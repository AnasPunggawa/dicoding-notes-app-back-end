/* eslint-disable no-underscore-dangle */

/**
 * @typedef {import('../../services/postgres/AuthenticationsService.js')} AuthenticationsService
 * @typedef {import('../../services/postgres/UsersService.js')} UsersService
 * @typedef {import('../../tokenize/TokenManager.js')} TokenManager
 * @typedef {import('../../validator/authentications/index.js')} AuthenticationsValidator
 * @typedef {import('../../types/HapiTypes.js').HapiRequest} HapiRequest
 * @typedef {import('../../types/HapiTypes.js').HapiResponseToolkit} HapiResponseToolkit
 * @typedef {import('../../types/HapiTypes.js').HapiResponseObject} HapiResponseObject
 */

class AuthenticationsHandler {
  /**
   * @param {AuthenticationsService} authenticationsService
   * @param {UsersService} usersService
   * @param {TokenManager} tokenManager
   * @param {AuthenticationsValidator} validator
   */
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    // eslint-disable-next-line operator-linebreak
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  /**
   * @param {HapiRequest} request
   * @param {HapiResponseToolkit} h
   * @returns {Promise<HapiResponseObject>}
   */
  async postAuthenticationHandler(request, h) {
    // @ts-ignore
    this._validator.validatePostAuthenticationPayload(request.payload);

    // @ts-ignore
    const id = await this._usersService.verifyUserCredential(request.payload);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);

    return response;
  }

  /**
   * @param {HapiRequest} request
   * @param {HapiResponseToolkit} h
   * @returns {Promise<HapiResponseObject>}
   */
  async putAuthenticationHandler(request, h) {
    // @ts-ignore
    this._validator.validatePutAuthenticationPayload(request.payload);

    // @ts-ignore
    const { refreshToken } = request.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);

    // @ts-ignore
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });

    const response = h.response({
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    });
    response.code(200);

    return response;
  }

  /**
   * @param {HapiRequest} request
   * @param {HapiResponseToolkit} h
   * @returns {Promise<HapiResponseObject>}
   */
  async deleteAuthenticationHandler(request, h) {
    // @ts-ignore
    this._validator.validateDeleteAuthenticationPayload(request.payload);

    // @ts-ignore
    const { refreshToken } = request.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);

    await this._authenticationsService.deleteRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
    response.code(200);

    return response;
  }
}

module.exports = AuthenticationsHandler;
