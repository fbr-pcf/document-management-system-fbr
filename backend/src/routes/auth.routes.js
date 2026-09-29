const express = require('express');

const AuthController = require('../controllers/auth.controller');
const UsersRepository = require('../repositories/users.repository');
const AuthService = require('../services/auth.service');
const createAuthMiddleware = require('../middlewares/auth.middleware');

const usersRepository = new UsersRepository();
const authService = new AuthService(usersRepository);
const controller = new AuthController(authService);
const authenticate = createAuthMiddleware(authService);
const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authenticate, controller.me);
router.post('/logout', controller.logout);

module.exports = { router, authService, authenticate };
