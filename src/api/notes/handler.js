/* eslint-disable no-underscore-dangle */

// const CLientError = require('../../exceptions/ClientError');

/**
 * @typedef {import('../../services/inMemory/NotesService.js')} NotesService
 * @typedef {import('../../types/hapiTypes.js').HapiRequest} HapiRequest
 * @typedef {import('../../types/hapiTypes.js').HapiResponseToolkit} HapiResponseToolkit
 * @typedef {import('../../types/hapiTypes.js').HapiResponseObject} HapiResponseObject
 */

class NotesHandler {
  /**
   * @param {NotesService} service
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
   * @returns {HapiResponseObject}
   */
  postNoteHandler(request, h) {
    this._validator.validateNotePayload(request.payload);

    // @ts-ignore
    const { title = 'untitled', body, tags } = request.payload;

    const noteId = this._service.addNote({ title, body, tags });

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
   * @param {HapiRequest} _request
   * @param {HapiResponseToolkit} h
   * @returns {HapiResponseObject}
   */
  getNotesHandler(_request, h) {
    const notes = this._service.getNotes();

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
   */
  getNoteByIdHandler(request, h) {
    const { id } = request.params;

    const note = this._service.getNoteById(id);

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
   * @returns {HapiResponseObject}
   */
  putNoteByIdHandler(request, h) {
    this._validator.validateNotePayload(request.payload);

    const { id } = request.params;

    // @ts-ignore
    // const { title, body, tags } = request.payload;
    // const updatedNote = this._service.editNoteById(id, { title, body, tags });

    const updatedNote = this._service.editNoteById(id, request.payload);

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
   * @returns {HapiResponseObject}
   */
  deleteNoteByIdHandler(request, h) {
    const { id } = request.params;

    const deletedNote = this._service.deleteNoteById(id);

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
