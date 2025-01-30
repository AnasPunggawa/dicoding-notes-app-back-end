/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBToNoteModel } = require('../../utils/mapDBToNoteModel');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * @typedef {import('../../services/postgres/CollaborationsService.js')} CollaborationsService
 * @typedef {import('../../types/NoteTypes').Note} Note
 * @typedef {import('../../types/NoteTypes').PayloadNote} PayloadNote
 */

class NotesService {
  /**
   *
   * @param {CollaborationsService} collaborationsService
   */
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  /**
   * @param {PayloadNote} payloadNote
   * @returns {Promise<string>}
   * @throws {InvariantError}
   */
  // eslint-disable-next-line object-curly-newline
  async addNote({ title, body, tags, owner }) {
    const id = nanoid(16);
    const timestamp = new Date().toISOString();

    const query = {
      text: 'INSERT INTO notes (id, title, body, tags, created_at, updated_at, owner) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, body, tags, timestamp, timestamp, owner],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0]?.id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return rows[0].id;
  }

  /**
   * @param {string} owner
   * @returns {Promise<Note[]>}
   */
  async getNotes(owner) {
    const query = {
      text: `SELECT notes.* FROM notes 
        LEFT JOIN collaborations ON collaborations.note_id = notes.id 
        WHERE notes.owner = $1 OR collaborations.user_id = $1 
        GROUP BY notes.id`,
      values: [owner],
    };

    const { rows } = await this._pool.query(query);

    return rows.map(mapDBToNoteModel);
  }

  /**
   * @param {string} id
   * @returns {Promise<Note>}
   * @throws {NotFoundError}
   */
  async getNoteById(id) {
    const query = {
      text: `SELECT notes.*, users.username
      FROM notes
      LEFT JOIN users ON users.id = notes.owner
      WHERE notes.id = $1`,
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    return mapDBToNoteModel(rows[0]);
  }

  /**
   * @param {string} id
   * @param {PayloadNote} payloadNote
   * @returns {Promise<Note>}
   * @throws {NotFoundError}
   */
  async editNoteById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING *',
      values: [title, body, tags, updatedAt, id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }

    return mapDBToNoteModel(rows[0]);
  }

  /**
   * @param {string} id
   * @returns {Promise<Note>}
   * @throws {NotFoundError}
   */
  async deleteNoteById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING *',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Gagal gagal dihapus. Id tidak ditemukan');
    }

    return mapDBToNoteModel(rows[0]);
  }

  /**
   * @param {string} id
   * @param {string} owner
   * @returns {Promise<void>}
   * @throws {NotFoundError | AuthorizationError}
   */
  async verifyNoteOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    if (rows[0]?.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  /**
   * @param {string} noteId
   * @param {string} userId
   */
  async verifyNoteAccess(noteId, userId) {
    // try {
    //   await this.verifyNoteOwner(noteId, userId);
    // } catch (error) {
    //   if (error instanceof NotFoundError) {
    //     throw error;
    //   } else {
    //     try {
    //       await this._collaborationsService.verifyCollaborator(noteId, userId);
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
    // }

    try {
      await this.verifyNoteOwner(noteId, userId);
      return;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
    }

    await this._collaborationsService.verifyCollaborator(noteId, userId);
  }
}

module.exports = NotesService;
