const InvariantError = require('../../exceptions/InvariantError.js');
const { UserPayloadSchema } = require('./schema.js');

/**
 * @typedef {import('../../types/UserTypes.js').PayloadUser} PayloadUser
 */

/**
 * @module UsersValidator
 */
const UsersValidator = {
  /**
   * @param {PayloadUser} payload
   * @returns {void}
   * @throws {InvariantError}
   */
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
