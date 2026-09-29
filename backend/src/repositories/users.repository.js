const crypto = require('node:crypto');

class UsersRepository {
  constructor() {
    this.usersById = new Map();
    this.userIdsByEmail = new Map();
  }

  findByEmail(email) {
    const userId = this.userIdsByEmail.get(email);
    return userId ? this.usersById.get(userId) : undefined;
  }

  findById(id) {
    return this.usersById.get(id);
  }

  create({ email, passwordHash }) {
    const user = {
      id: crypto.randomUUID(),
      email,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    this.usersById.set(user.id, user);
    this.userIdsByEmail.set(user.email, user.id);
    return user;
  }
}

module.exports = UsersRepository;
