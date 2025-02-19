/* eslint-disable no-underscore-dangle */

/**
 * @typedef {import('../../rabbitmq/ProducerService')} ProducerService
 * @typedef {import('../../validator/exports')} ExportsValidator
 * @typedef {import('../../types/HapiTypes').HapiRequest} HapiRequest
 * @typedef {import('../../types/HapiTypes').HapiResponseToolkit} HapiResponseToolkit
 * @typedef {import('../../types/HapiTypes').HapiResponseObject} HapiResponseObject
 */

class ExportsHandler {
  /**
   * @param {ProducerService} service
   * @param {ExportsValidator} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
  }

  /**
   * @param {HapiRequest} request
   * @param {HapiResponseToolkit} h
   * @returns {Promise<HapiResponseObject>}
   */
  async postExportNotesHandler(request, h) {
    // @ts-ignore
    this._validator.validateExportNotesPayload(request.payload);

    const message = {
      credentialId: request.auth.credentials.id,
      // @ts-ignore
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:notes', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);

    return response;
  }
}

module.exports = ExportsHandler;
