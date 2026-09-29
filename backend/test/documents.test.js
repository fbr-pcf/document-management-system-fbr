const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const app = require('../src/app');

const storageDirectory = path.resolve(__dirname, '../storage');
let server;
let baseUrl;
let filesBeforeTests;

before(async () => {
  filesBeforeTests = new Set(await fs.readdir(storageDirectory));
  server = app.listen(0);
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  const filesAfterTests = await fs.readdir(storageDirectory);
  const createdFiles = filesAfterTests.filter((file) => !filesBeforeTests.has(file));

  await Promise.all(
    createdFiles.map((file) => fs.unlink(path.join(storageDirectory, file)))
  );
});

test('faz upload, lista e baixa um documento', async () => {
  const formData = new FormData();
  formData.append(
    'file',
    new Blob(['conteudo de teste'], { type: 'text/plain' }),
    'teste.txt'
  );

  const uploadResponse = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: formData
  });

  assert.equal(uploadResponse.status, 201);
  const uploadBody = await uploadResponse.json();
  const uploadedDocument = uploadBody.document;

  assert.equal(uploadedDocument.originalName, 'teste.txt');
  assert.equal(uploadedDocument.size, 17);
  assert.equal(uploadedDocument.owner, 'local-user');
  assert.equal('filePath' in uploadedDocument, false);
  assert.equal('storedFilename' in uploadedDocument, false);

  const listResponse = await fetch(`${baseUrl}/documents`);
  assert.equal(listResponse.status, 200);
  const listBody = await listResponse.json();
  assert.ok(listBody.documents.some((document) => document.id === uploadedDocument.id));

  const downloadResponse = await fetch(
    `${baseUrl}/documents/${uploadedDocument.id}/download`
  );
  assert.equal(downloadResponse.status, 200);
  assert.equal(await downloadResponse.text(), 'conteudo de teste');
});

test('retorna 404 ao baixar um documento inexistente', async () => {
  const response = await fetch(`${baseUrl}/documents/documento-inexistente/download`);

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    error: { message: 'Documento não encontrado.' }
  });
});