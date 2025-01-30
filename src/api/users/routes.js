/**
 * @param {import('./handler.js')} handler
 * @returns {import('../../types/HapiTypes.js').HapiRoute}
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsersByUsernameHandler,
  },
];

module.exports = routes;
