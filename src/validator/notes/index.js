const InvariantError = require('../../exceptions/InvariantError.js');
const { NotePayloadSchema } = require('./schema.js');

/**
 * @typedef {import('../../types/NoteTypes.js').PayloadNote} PayloadNote
 */

/**
 * @module NotesValidator
 */
const NotesValidator = {
  /**
   * @param {PayloadNote} payload
   * @returns {void}
   * @throws {InvariantError}
   */
  validateNotePayload: (payload) => {
    const validationResult = NotePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = NotesValidator;
