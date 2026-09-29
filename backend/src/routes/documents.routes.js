const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const multer = require('multer');

const DocumentsRepository = require('../repositories/documents.repository');
const DocumentsService = require('../services/documents.service');

const storageDirectory = path.resolve(__dirname, '../../storage');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    fs.mkdir(storageDirectory, { recursive: true }, (error) => {
      callback(error, storageDirectory);
    });
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomUUID()}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE_BYTES) || 10 * 1024 * 1024
  }
});

function createDocumentsRouter({ authenticate, DocumentsController }) {
  const repository = new DocumentsRepository();
  const service = new DocumentsService(repository);
  const controller = new DocumentsController(service);
  const router = require('express').Router();

  router.post('/upload', authenticate, upload.single('file'), controller.upload);
  router.get('/documents', authenticate, controller.list);
  router.get('/documents/:id/download', authenticate, controller.download);

  return router;
}

module.exports = { createDocumentsRouter };
