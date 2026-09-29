const { cookieName } = require('../config/auth.config');

function parseCookies(header = '') {
  return header.split(';').reduce((cookies, part) => {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex === -1) {
      return cookies;
    }

    const name = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();
    cookies[name] = decodeURIComponent(value);
    return cookies;
  }, {});
}

function createAuthMiddleware(authService) {
  return (req, res, next) => {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[cookieName];

    if (!token) {
      const error = new Error('Não autorizado.');
      error.statusCode = 401;
      return next(error);
    }

    try {
      req.user = authService.authenticateToken(token);
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = createAuthMiddleware;
