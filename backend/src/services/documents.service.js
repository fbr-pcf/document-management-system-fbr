const { toPublicDocument } = require('./documents.mapper');

class DocumentsService {
  constructor(repository) {
    this.repository = repository;
  }

  upload(file, owner) {
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
        owner,
        storedFilename: file.filename
      })
    );
  }

  list() {
    return this.repository.findAll().map(toPublicDocument);
  }

  getDownload(id) {
    const document = this.repository.findById(id);

    if (!document) {
      const error = new Error('Documento não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    return document;
  }
}

module.exports = DocumentsService;
