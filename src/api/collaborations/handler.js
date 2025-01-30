/* eslint-disable no-underscore-dangle */

/**
 * @typedef {import('../../services/postgres/CollaborationsService.js')} CollaborationsService
 * @typedef {import('../../services/postgres/NotesService.js')} NotesService
 * @typedef {import('../../validator/collaborations/index.js')} CollaborationsValidator
 * @typedef {import('../../types/HapiTypes.js').HapiRequest} HapiRequest
 * @typedef {import('../../types/HapiTypes.js').HapiResponseToolkit} HapiResponseToolkit
 * @typedef {import('../../types/HapiTypes.js').HapiResponseObject} HapiResponseObject
 */

class CollaborationsHandler {
  /**
   * @param {CollaborationsService} collaborationsService
   * @param {NotesService} notesService
   * @param {CollaborationsValidator} validator
   */
  constructor(collaborationsService, notesService, validator) {
    this._collaborationsService = collaborationsService;
    this._notesService = notesService;
    this._validator = validator;

    this.postCollaborationsHandler = this.postCollaborationsHandler.bind(this);
    // eslint-disable-next-line operator-linebreak
    this.deleteCollaborationsHandler =
      this.deleteCollaborationsHandler.bind(this);
  }

  /**
   * @param {HapiRequest} request
   * @param {HapiResponseToolkit} h
   * @returns {Promise<HapiResponseObject>}
   */
  async postCollaborationsHandler(request, h) {
    // @ts-ignore
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    // @ts-ignore
    const { noteId, userId } = request.payload;

    // @ts-ignore
    await this._notesService.verifyNoteOwner(noteId, credentialId);

    await this._collaborationsService.verifyCollaborationExist({
      noteId,
      userId,
    });

    const collaborationId = await this._collaborationsService.addCollaboration({
      noteId,
      userId,
    });

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
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
  async deleteCollaborationsHandler(request, h) {
    // @ts-ignore
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    // @ts-ignore
    const { noteId, userId } = request.payload;

    // @ts-ignore
    await this._notesService.verifyNoteOwner(noteId, credentialId);

    await this._collaborationsService.deleteCollaboration({ noteId, userId });

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    });
    response.code(200);

    return response;
  }
}

module.exports = CollaborationsHandler;
