const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtExpiresIn, jwtSecret } = require('../config/auth.config');

class AuthService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async register(email, password) {
    const normalizedEmail = this.normalizeEmail(email);
    this.validateCredentials(normalizedEmail, password);

    if (this.usersRepository.findByEmail(normalizedEmail)) {
      throw this.createError('Credenciais inválidas.', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = this.usersRepository.create({
      email: normalizedEmail,
      passwordHash
    });

    return this.toPublicUser(user);
  }

  async login(email, password) {
    const normalizedEmail = this.normalizeEmail(email);
    const user = this.usersRepository.findByEmail(normalizedEmail);
    const passwordMatches = user && await bcrypt.compare(password || '', user.passwordHash);

    if (!passwordMatches) {
      throw this.createError('Credenciais inválidas.', 401);
    }

    return {
      user: this.toPublicUser(user),
      token: jwt.sign({ sub: user.id, email: user.email }, jwtSecret, {
        expiresIn: jwtExpiresIn
      })
    };
  }

  authenticateToken(token) {
    try {
      const payload = jwt.verify(token, jwtSecret);
      const user = this.usersRepository.findById(payload.sub);

      if (!user) {
        throw this.createError('Não autorizado.', 401);
      }

      return this.toPublicUser(user);
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }

      throw this.createError('Não autorizado.', 401);
    }
  }

  normalizeEmail(email) {
    return typeof email === 'string' ? email.trim().toLowerCase() : '';
  }

  validateCredentials(email, password) {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      throw this.createError('E-mail inválido.', 400);
    }

    if (typeof password !== 'string' || password.length < 8) {
      throw this.createError('A senha deve ter pelo menos 8 caracteres.', 400);
    }
  }

  toPublicUser(user) {
    return { id: user.id, email: user.email };
  }

  createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  }
}

module.exports = AuthService;
