class DocumentsController {
  constructor(service) {
    this.service = service;
    this.upload = this.upload.bind(this);
    this.list = this.list.bind(this);
    this.download = this.download.bind(this);
  }

  upload(req, res, next) {
    try {
      const document = this.service.upload(req.file, req.user.id);
      res.status(201).json({ document });
    } catch (error) {
      next(error);
    }
  }

  list(req, res, next) {
    try {
      res.json({ documents: this.service.list(req.user.id) });
    } catch (error) {
      next(error);
    }
  }

  download(req, res, next) {
    try {
      const document = this.service.getDownload(req.params.id, req.user.id);
      res.download(document.filePath, document.originalName, (error) => {
        if (error && !res.headersSent) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DocumentsController;
