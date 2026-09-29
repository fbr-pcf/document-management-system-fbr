const { test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

const email = `auth-${Date.now()}@example.com`;
const password = 'senha-segura-123';

test('registra, autentica e consulta o usuário atual', async () => {
  const server = app.listen(0);

  try {
    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}`;
    const registerResponse = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    assert.equal(registerResponse.status, 201);
    const registerBody = await registerResponse.json();
    assert.equal(registerBody.user.email, email);

    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    assert.equal(loginResponse.status, 200);

    const setCookie = loginResponse.headers.getSetCookie?.()[0]
      || loginResponse.headers.get('set-cookie');
    const meResponse = await fetch(`${baseUrl}/auth/me`, {
      headers: { Cookie: setCookie.split(';')[0] }
    });

    assert.equal(meResponse.status, 200);
    const meBody = await meResponse.json();
    assert.equal(meBody.user.id, registerBody.user.id);
    assert.equal(meBody.user.email, email);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('recusa acesso a documentos sem autenticação', async () => {
  const server = app.listen(0);

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/documents`);
    assert.equal(response.status, 401);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});