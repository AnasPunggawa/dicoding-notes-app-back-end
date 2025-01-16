const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * @typedef {import('../../types/notesTypes.js').Note} Note
 * @typedef {import('../../types/notesTypes.js').PayloadNote} PayloadNote
 */

/* eslint-disable no-underscore-dangle */
class NotesService {
  constructor() {
    /**
     * @type {Note[]}
     */
    this._notes = [];
  }

  /**
   * @param {PayloadNote} note
   * @returns {string}
   * @throws {Error}
   */
  addNote({ title, body, tags }) {
    const id = nanoid(16);
    const timestamp = new Date().toISOString();

    /**
     * @type {Note}
     */
    const newNote = {
      id,
      title,
      body,
      tags,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this._notes.push(newNote);

    const isSuccess = this._notes.some((note) => note.id === id);

    if (!isSuccess) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return id;
  }

  /**
   * @returns {Note[]}
   */
  getNotes() {
    return this._notes;
  }

  /**
   * @param {string} id
   * @returns {Note}
   * @throws {Error}
   */
  getNoteById(id) {
    const note = this._notes.find((nt) => nt.id === id);

    if (!note) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    return note;
  }

  /**
   * @param {string} id
   * @param {PayloadNote} note
   * @returns {Note}
   * @throws {Error}
   */
  editNoteById(id, { title, body, tags }) {
    const noteIndex = this._notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }

    const updatedAt = new Date().toISOString();

    /**
     * @type {Note}
     */
    const updatedNote = {
      ...this._notes[noteIndex],
      title,
      body,
      tags,
      updatedAt,
    };

    this._notes[noteIndex] = updatedNote;

    return updatedNote;
  }

  /**
   * @param {string} id
   * @returns {Note}
   * @throws {Error}
   */
  deleteNoteById(id) {
    const noteIndex = this._notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }

    const [deletedNote] = this._notes.splice(noteIndex, 1);

    return deletedNote;
  }
}

module.exports = NotesService;
