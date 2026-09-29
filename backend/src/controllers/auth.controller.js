const { cookieName, jwtExpiresIn } = require('../config/auth.config');

class AuthController {
  constructor(service) {
    this.service = service;
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.me = this.me.bind(this);
    this.logout = this.logout.bind(this);
  }

  async register(req, res, next) {
    try {
      const user = await this.service.register(req.body?.email, req.body?.password);
      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { user, token } = await this.service.login(
        req.body?.email,
        req.body?.password
      );
      res.setHeader('Set-Cookie', this.createCookie(token));
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  me(req, res) {
    res.json({ user: req.user });
  }

  logout(req, res) {
    res.setHeader('Set-Cookie', `${cookieName}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
    res.status(204).end();
  }

  createCookie(token) {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    const maxAge = this.maxAgeInSeconds();
    return `${cookieName}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`;
  }

  maxAgeInSeconds() {
    const match = /^([0-9]+)([smhd])$/.exec(jwtExpiresIn);
    if (!match) {
      return 3600;
    }

    const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
    return Number(match[1]) * multipliers[match[2]];
  }
}

module.exports = AuthController;
