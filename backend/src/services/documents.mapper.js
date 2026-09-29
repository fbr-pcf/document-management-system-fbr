function toPublicDocument(document) {
  return {
    id: document.id,
    originalName: document.originalName,
    size: document.size,
    mimetype: document.mimetype,
    uploadedAt: document.uploadedAt
  };
}

module.exports = { toPublicDocument };
