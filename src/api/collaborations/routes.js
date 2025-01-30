/**
 * @typedef {import('./handler')} CollaborationsHandler
 * @typedef {import('../../types/HapiTypes').HapiRoute} HapiRoute
 */

/**
 *
 * @param {CollaborationsHandler} handler
 * @returns {HapiRoute}
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationsHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationsHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
];

module.exports = routes;
