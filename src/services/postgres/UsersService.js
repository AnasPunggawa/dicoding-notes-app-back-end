/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

/**
 * @typedef {import('../../types/UserTypes.js').PayloadUser} PayloadUser
 * @typedef {import('../../types/UserTypes.js').PayloadUserCredential} PayloadUserCredential
 */

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {PayloadUser} payload
   * @returns {Promise<string>}
   * @throws {InvariantError}
   */
  async addUser({ username, password, fullname }) {
    await this._verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: `INSERT INTO users (id, username, password, fullname) 
      VALUES ($1, $2, $3, $4)
      RETURNING id`,
      values: [id, username, hashedPassword, fullname],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0]?.id) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return rows[0]?.id;
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return rows[0];
  }

  /**
   * @param {string} username
   */
  async _verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length !== 0) {
      throw new InvariantError(
        // eslint-disable-next-line comma-dangle
        'Gagal menambahkan user. Username sudah digunakan.'
      );
    }
  }

  /**
   * @param {PayloadUserCredential} payload
   * @returns {Promise<string>}
   * @throws {AuthenticationError}
   */
  async verifyUserCredential({ username, password }) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = rows[0];

    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }
}

module.exports = UsersService;
