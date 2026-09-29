const jwtSecret = process.env.JWT_SECRET || (
  process.env.NODE_ENV === 'production' ? null : 'dms-development-only-secret'
);

if (!jwtSecret) {
  throw new Error('JWT_SECRET é obrigatório em produção.');
}

module.exports = {
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  cookieName: 'dms_access_token'
};
