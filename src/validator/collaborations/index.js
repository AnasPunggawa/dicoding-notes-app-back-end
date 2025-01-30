const InvariantError = require('../../exceptions/InvariantError');
const { CollaborationPayloadSchema } = require('./schema');

/**
 * @typedef {import('../../types/CollaborationTypes').PayloadCollaboration} PayloadCollaboration
 */

/**
 * @module CollaborationsValidator
 */
const CollaborationsValidator = {
  /**
   * @param {PayloadCollaboration} payload
   * @returns {void}
   * @throws {InvariantError}
   */
  validateCollaborationPayload: (payload) => {
    const validationResult = CollaborationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
