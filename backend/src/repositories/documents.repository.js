const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const storageDirectory = path.resolve(__dirname, '../../storage');

class DocumentsRepository {
  constructor() {
    fs.mkdirSync(storageDirectory, { recursive: true });
    this.documents = new Map();
  }

  create({ originalName, size, mimetype, ownerId, storedFilename }) {
    const document = {
      id: crypto.randomUUID(),
      originalName,
      size,
      mimetype,
      uploadedAt: new Date().toISOString(),
      ownerId,
      storedFilename,
      filePath: path.join(storageDirectory, storedFilename)
    };

    this.documents.set(document.id, document);
    return document;
  }

  findAll(ownerId) {
    return [...this.documents.values()]
      .filter((document) => document.ownerId === ownerId)
      .sort((first, second) =>
      second.uploadedAt.localeCompare(first.uploadedAt)
      );
  }

  findByIdForOwner(id, ownerId) {
    const document = this.documents.get(id);
    return document?.ownerId === ownerId ? document : undefined;
  }
}

module.exports = DocumentsRepository;
