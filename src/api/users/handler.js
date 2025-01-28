/* eslint-disable no-underscore-dangle */

/**
 * @typedef {import('../../services/postgres/UsersService.js')} UsersService
 * @typedef {import('../../validator/users/index.js')} UsersValidator
 * @typedef {import('../../types/HapiTypes.js').HapiRequest} HapiRequest
 * @typedef {import('../../types/HapiTypes.js').HapiResponseToolkit} HapiResponseToolkit
 * @typedef {import('../../types/HapiTypes.js').HapiResponseObject} HapiResponseObject
 */

class UsersHandler {
  /**
   * @param {UsersService} service
   * @param {UsersValidator} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  /**
   * @param {HapiRequest} request
   * @param {HapiResponseToolkit} h
   * @returns {Promise<HapiResponseObject>}
   */
  async postUserHandler(request, h) {
    // @ts-ignore
    this._validator.validateUserPayload(request.payload);

    // @ts-ignore
    const userId = await this._service.addUser(request.payload);

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
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
  async getUserByIdHandler(request, h) {
    const { id } = request.params;

    const user = await this._service.getUserById(id);

    const response = h.response({
      status: 'success',
      data: {
        user,
      },
    });
    response.code(200);

    return response;
  }
}

module.exports = UsersHandler;
