const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const app = require('../src/app');

const storageDirectory = path.resolve(__dirname, '../storage');
let server;
let baseUrl;
let filesBeforeTests;
let firstUserCookie;
let secondUserCookie;

async function createUser(email) {
  const password = 'senha-segura-123';
  const registerResponse = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  assert.equal(registerResponse.status, 201);

  const loginResponse = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  assert.equal(loginResponse.status, 200);

  const setCookie = loginResponse.headers.getSetCookie?.()[0]
    || loginResponse.headers.get('set-cookie');
  return setCookie.split(';')[0];
}

before(async () => {
  filesBeforeTests = new Set(await fs.readdir(storageDirectory));
  server = app.listen(0);
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
  firstUserCookie = await createUser('primeiro@example.com');
  secondUserCookie = await createUser('segundo@example.com');
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
    headers: { Cookie: firstUserCookie },
    body: formData
  });

  assert.equal(uploadResponse.status, 201);
  const uploadBody = await uploadResponse.json();
  const uploadedDocument = uploadBody.document;

  assert.equal(uploadedDocument.originalName, 'teste.txt');
  assert.equal(uploadedDocument.size, 17);
  assert.equal('filePath' in uploadedDocument, false);
  assert.equal('storedFilename' in uploadedDocument, false);

  const listResponse = await fetch(`${baseUrl}/documents`, {
    headers: { Cookie: firstUserCookie }
  });
  assert.equal(listResponse.status, 200);
  const listBody = await listResponse.json();
  assert.ok(listBody.documents.some((document) => document.id === uploadedDocument.id));

  const downloadResponse = await fetch(
    `${baseUrl}/documents/${uploadedDocument.id}/download`,
    { headers: { Cookie: firstUserCookie } }
  );
  assert.equal(downloadResponse.status, 200);
  assert.equal(await downloadResponse.text(), 'conteudo de teste');
});

test('retorna 404 ao baixar um documento inexistente', async () => {
  const response = await fetch(`${baseUrl}/documents/documento-inexistente/download`, {
    headers: { Cookie: firstUserCookie }
  });

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    error: { message: 'Documento não encontrado.' }
  });
});

test('isola documentos entre usuários autenticados', async () => {
  const formData = new FormData();
  formData.append(
    'file',
    new Blob(['documento privado'], { type: 'text/plain' }),
    'privado.txt'
  );

  const uploadResponse = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    headers: { Cookie: firstUserCookie },
    body: formData
  });
  const { document } = await uploadResponse.json();

  const secondUserList = await fetch(`${baseUrl}/documents`, {
    headers: { Cookie: secondUserCookie }
  });
  const { documents } = await secondUserList.json();

  assert.equal(secondUserList.status, 200);
  assert.equal(documents.some((item) => item.id === document.id), false);

  const secondUserDownload = await fetch(
    `${baseUrl}/documents/${document.id}/download`,
    { headers: { Cookie: secondUserCookie } }
  );
  assert.equal(secondUserDownload.status, 404);
});