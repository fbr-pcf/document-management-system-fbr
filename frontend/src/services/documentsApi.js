const API_PREFIX = '/api';

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  if (response.ok) {
    return response.json();
  }

  const body = await response.json().catch(() => null);
  const message = body?.error?.message || 'Não foi possível concluir a operação.';
  throw new Error(message);
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_PREFIX}/upload`, {
    method: 'POST',
    credentials: 'same-origin',
    body: formData,
  });

  const body = await parseResponse(response);
  return body.document;
}

export async function listDocuments() {
  const response = await fetch(`${API_PREFIX}/documents`, {
    credentials: 'same-origin',
  });
  const body = await parseResponse(response);
  return body.documents;
}

export async function registerUser(email, password) {
  const response = await fetch(`${API_PREFIX}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const body = await parseResponse(response);
  return body.user;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_PREFIX}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ email, password }),
  });

  const body = await parseResponse(response);
  return body.user;
}

export async function getCurrentUser() {
  const response = await fetch(`${API_PREFIX}/auth/me`, {
    credentials: 'same-origin',
  });

  const body = await parseResponse(response);
  return body.user;
}

export async function logoutUser() {
  const response = await fetch(`${API_PREFIX}/auth/logout`, {
    method: 'POST',
    credentials: 'same-origin',
  });

  await parseResponse(response);
}

export function getDocumentDownloadUrl(id) {
  return `${API_PREFIX}/documents/${encodeURIComponent(id)}/download`;
}
