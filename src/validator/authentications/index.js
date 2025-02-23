const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('./schema.js');
const InvariantError = require('../../exceptions/InvariantError.js');

/**
 * @typedef {import('../../types/UserTypes.js').PayloadUserCredential} PayloadUserCredential
 */

/**
 * @module AuthenticationsValidator
 */
const AuthenticationsValidator = {
  /**
   * @param {PayloadUserCredential} payload
   */
  validatePostAuthenticationPayload: (payload) => {
    const validationResult = PostAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  /**
   * @param {Object} payload
   * @param {string} payload.refreshToken
   */
  validatePutAuthenticationPayload: (payload) => {
    const validationResult = PutAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  /**
   * @param {Object} payload
   * @param {string} payload.refreshToken
   */
  validateDeleteAuthenticationPayload: (payload) => {
    // eslint-disable-next-line operator-linebreak
    const validationResult =
      DeleteAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
