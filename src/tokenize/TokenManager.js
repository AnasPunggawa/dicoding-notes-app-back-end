const process = require('process');
const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError.js');

/**
 * @typedef {import('../types/HapiTypes.js').HapiDecodedToken} HapiDecodedToken
 */

const TokenManager = {
  /**
   * @param {Object} payload
   * @param {string} payload.id
   * @returns {string}
   */
  generateAccessToken: (payload) =>
    // @ts-ignore
    // eslint-disable-next-line implicit-arrow-linebreak
    Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),

  /**
   * @param {Object} payload
   * @param {string} payload.id
   * @returns {string}
   */
  generateRefreshToken: (payload) =>
    // @ts-ignore
    // eslint-disable-next-line implicit-arrow-linebreak
    Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),

  /**
   * @param {string} refreshToken
   * @returns {HapiDecodedToken}
   * @throws {InvariantError}
   */
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);

      // @ts-ignore
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);

      const { payload } = artifacts.decoded;

      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
