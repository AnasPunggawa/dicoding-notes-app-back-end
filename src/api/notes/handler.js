/* eslint-disable no-underscore-dangle */

/**
 * @typedef {import('../../services/postgres/NotesService.js')} NotesService
 * @typedef {import('../../validator/notes/index.js')} NotesValidator
 * @typedef {import('../../types/HapiTypes.js').HapiRequest} HapiRequest
 * @typedef {import('../../types/HapiTypes.js').HapiResponseToolkit} HapiResponseToolkit
 * @typedef {import('../../types/HapiTypes.js').HapiResponseObject} HapiResponseObject
 */

class NotesHandler {
  /**
   * @param {NotesService} service
   * @param {NotesValidator} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  /**
   *
   * @param {HapiRequest} request
   * @param {HapiResponseToolkit} h
   * @returns {Promise<HapiResponseObject>}
   */
  async postNoteHandler(request, h) {
    // @ts-ignore
    this._validator.validateNotePayload(request.payload);

    // @ts-ignore
    const { title = 'untitled', body, tags } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const noteId = await this._service.addNote({
      title,
      body,
      tags,
      // @ts-ignore
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId,
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
  async getNotesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    // @ts-ignore
    const notes = await this._service.getNotes(credentialId);

    const response = h.response({
      status: 'success',
      data: {
        notes,
      },
    });
    response.code(200);

    return response;
  }

  /**
   * @param {HapiRequest} request
   * @param {HapiResponseToolkit} h
   * @return {Promise<HapiResponseObject>}
   */
  async getNoteByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    // @ts-ignore
    await this._service.verifyNoteAccess(id, credentialId);

    const note = await this._service.getNoteById(id);

    const response = h.response({
      status: 'success',
      data: {
        note,
      },
    });
    response.code(200);

    return response;
  }

  /**
   * @param {HapiRequest} request
   * @param {HapiResponseToolkit} h
   * @return {Promise<HapiResponseObject>}
   */
  async putNoteByIdHandler(request, h) {
    // @ts-ignore
    this._validator.validateNotePayload(request.payload);

    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    // @ts-ignore
    const { title, body, tags } = request.payload;

    // @ts-ignore
    await this._service.verifyNoteAccess(id, credentialId);

    // @ts-ignore
    const updatedNote = await this._service.editNoteById(id, {
      title,
      body,
      tags,
    });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
      data: {
        note: updatedNote,
      },
    });
    response.code(200);

    return response;
  }

  /**
   * @param {HapiRequest} request
   * @param {HapiResponseToolkit} h
   * @return {Promise<HapiResponseObject>}
   */
  async deleteNoteByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    // @ts-ignore
    await this._service.verifyNoteOwner(id, credentialId);

    const deletedNote = await this._service.deleteNoteById(id);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
      data: {
        note: deletedNote,
      },
    });
    response.code(200);

    return response;
  }
}

module.exports = NotesHandler;
