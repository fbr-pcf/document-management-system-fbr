// Seed do servidor backend do Document Management System.
//
// Este arquivo é apenas um ponto de partida mínimo. Ao longo do workshop você
// vai usar o Agent Mode do GitHub Copilot para construir as camadas:
//   - routes/       (definição das rotas)
//   - controllers/  (entrada HTTP e validação)
//   - services/     (regras de negócio)
//   - repositories/ (persistência: arquivos locais + metadados em memória)
//
// Restrição do projeto: uploads são gravados no filesystem local da aplicação
// usando multer com diskStorage. Não utilize provedores externos.

const express = require('express');
const DocumentsController = require('./controllers/documents.controller');
const authRoutes = require('./routes/auth.routes');
const { createDocumentsRouter } = require('./routes/documents.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/auth', authRoutes.router);
app.use(createDocumentsRouter({
  authenticate: authRoutes.authenticate,
  DocumentsController
}));

// Endpoint de verificação de saúde.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const isMulterClientError = typeof error.code === 'string' &&
    error.code.startsWith('LIMIT_');
  const statusCode = isMulterClientError
    ? 400
    : error.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: statusCode === 500 ? 'Erro interno do servidor.' : error.message
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DMS backend ouvindo na porta ${PORT}`);
  });
}

module.exports = app;
