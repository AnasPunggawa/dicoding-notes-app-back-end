/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToNoteModel } = require('../../utils/mapDBToNoteModel');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * @typedef {import('../../types/NoteTypes').Note} Note
 * @typedef {import('../../types/NoteTypes').PayloadNote} PayloadNote
 */

class NotesService {
  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {PayloadNote} payloadNote
   * @returns {Promise<string>}
   * @throws {InvariantError}
   */
  async addNote({ title, body, tags }) {
    const id = nanoid(16);
    const timestamp = new Date().toISOString();

    const query = {
      text: 'INSERT INTO notes (id, title, body, tags, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, title, body, tags, timestamp, timestamp],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0]?.id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return rows[0].id;
  }

  /**
   * @returns {Promise<Note[]>}
   */
  async getNotes() {
    const { rows } = await this._pool.query('SELECT * FROM notes');

    return rows.map(mapDBToNoteModel);
  }

  /**
   * @param {string} id
   * @returns {Promise<Note>}
   * @throws {NotFoundError}
   */
  async getNoteById(id) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
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
}

module.exports = NotesService;
