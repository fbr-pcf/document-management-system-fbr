const { toPublicDocument } = require('./documents.mapper');

class DocumentsService {
  constructor(repository) {
    this.repository = repository;
  }

  upload(file, ownerId) {
    if (!file) {
      const error = new Error('Arquivo é obrigatório.');
      error.statusCode = 400;
      throw error;
    }

    return toPublicDocument(
      this.repository.create({
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        ownerId,
        storedFilename: file.filename
      })
    );
  }

  list(ownerId) {
    return this.repository.findAll(ownerId).map(toPublicDocument);
  }

  getDownload(id, ownerId) {
    const document = this.repository.findByIdForOwner(id, ownerId);

    if (!document) {
      const error = new Error('Documento não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    return document;
  }
}

module.exports = DocumentsService;
