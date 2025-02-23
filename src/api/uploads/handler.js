/* eslint-disable no-underscore-dangle */
const { basename, resolve } = require('node:path');

/**
 * @typedef {import('../../services/storage/StorageService')} StorageService
 * @typedef {import('../../validator/uploads')} UploadsValidator
 * @typedef {import('../../types/HapiTypes').HapiRequest} HapiRequest
 * @typedef {import('../../types/HapiTypes').HapiResponseToolkit} HapiResponseToolkit
 * @typedef {import('../../types/HapiTypes').HapiResponseObject} HapiResponseObject
 */

class UploadsHandler {
  /**
   * @param {StorageService} service
   * @param {UploadsValidator} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    this.getUploadImageHandler = this.getUploadImageHandler.bind(this);
  }

  /**
   * @param {HapiRequest} request
   * @param {HapiResponseToolkit} h
   * @returns {Promise<HapiResponseObject>}
   */
  async postUploadImageHandler(request, h) {
    // @ts-ignore
    const { data } = request.payload;

    this._validator.validateImageHeaders(data.hapi.headers);

    const fileLocation = await this._service.writeFile(data, data.hapi);

    const response = h.response({
      status: 'success',
      data: {
        fileLocation,
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
  async getUploadImageHandler(request, h) {
    const folderPath = this._service.getFolderPath();
    const fileName = basename(request.params.image);

    const filePath = resolve(folderPath, fileName);

    const response = h.file(filePath).code(200);

    return response;
  }
}

module.exports = UploadsHandler;
