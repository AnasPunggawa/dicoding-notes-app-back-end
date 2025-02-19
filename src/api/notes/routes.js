/**
 * @param {import('./handler.js')} handler
 * @returns {import('../../types/HapiTypes.js').HapiRoute}
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/notes',
    // handler: (request, h) => handler.postNoteHandler(request, h),
    handler: handler.postNoteHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/notes',
    // handler: (request, h) => handler.getNotesHandler(request, h),
    handler: handler.getNotesHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    // handler: (request, h) => handler.getNoteByIdHandler(request, h),
    handler: handler.getNoteByIdHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    // handler: (request, h) => handler.putNoteByIdHandler(request, h),
    handler: handler.putNoteByIdHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    // handler: (request, h) => handler.deleteNoteByIdHandler(request, h),
    handler: handler.deleteNoteByIdHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
];

module.exports = routes;
