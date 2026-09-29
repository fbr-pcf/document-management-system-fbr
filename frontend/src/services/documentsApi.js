const API_PREFIX = '/api';

async function parseResponse(response) {
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
    body: formData,
  });

  const body = await parseResponse(response);
  return body.document;
}

export async function listDocuments() {
  const response = await fetch(`${API_PREFIX}/documents`);
  const body = await parseResponse(response);
  return body.documents;
}

export function getDocumentDownloadUrl(id) {
  return `${API_PREFIX}/documents/${encodeURIComponent(id)}/download`;
}
