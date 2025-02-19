/**
 * @typedef {import('./handler')} ExportsHandler
 * @typedef {import('../../types/HapiTypes').HapiRoute} HapiRoute
 */

/**
 * @param {ExportsHandler} handler
 * @returns {HapiRoute}
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/notes',
    handler: handler.postExportNotesHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
];

module.exports = routes;
