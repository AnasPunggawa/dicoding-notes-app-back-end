/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * @typedef {import('../../types/CollaborationTypes.js').Collaboration} Collaboration
 * @typedef {import('../../types/CollaborationTypes.js').PayloadCollaboration} PayloadCollaboration
 */

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {PayloadCollaboration} payload
   * @returns {Promise<string>}
   * @throws {InvariantError}
   */
  async addCollaboration({ noteId, userId }) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations(id, note_id, user_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, noteId, userId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0]?.id) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    return rows[0]?.id;
  }

  /**
   * @param {PayloadCollaboration} payload
   * @returns {Promise<string>}
   * @throws {InvariantError}
   */
  async deleteCollaboration({ noteId, userId }) {
    const query = {
      text: 'DELETE FROM collaborations WHERE note_id = $1 AND user_id = $2 RETURNING id',
      values: [noteId, userId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }

    return rows[0]?.id;
  }

  /**
   * @param {string} noteId
   * @param {string} userId
   * @returns {Promise<void>}
   * @throws {InvariantError}
   */
  async verifyCollaborator(noteId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2',
      values: [noteId, userId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }

  async verifyCollaborationExist({ noteId, userId }) {
    const query = {
      text: 'SELECT id FROM collaborations WHERE note_id = $1 AND user_id = $2',
      values: [noteId, userId],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      throw new InvariantError('Kolaborasi untuk user ini sudah ditambahkan');
    }
  }
}

module.exports = CollaborationsService;
