const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const storageDirectory = path.resolve(__dirname, '../../storage');

class DocumentsRepository {
  constructor() {
    fs.mkdirSync(storageDirectory, { recursive: true });
    this.documents = new Map();
  }

  create({ originalName, size, mimetype, owner, storedFilename }) {
    const document = {
      id: crypto.randomUUID(),
      originalName,
      size,
      mimetype,
      uploadedAt: new Date().toISOString(),
      owner,
      storedFilename,
      filePath: path.join(storageDirectory, storedFilename)
    };

    this.documents.set(document.id, document);
    return document;
  }

  findAll() {
    return [...this.documents.values()].sort((first, second) =>
      second.uploadedAt.localeCompare(first.uploadedAt)
    );
  }

  findById(id) {
    return this.documents.get(id);
  }
}

module.exports = DocumentsRepository;
