/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable no-trailing-spaces */
const AuthenticationsHandler = require('./handler.js');
const routes = require('./routes.js');

/**
 * @type {import('../../types/HapiTypes.js').HapiPlugin}
 */
module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (
    server,
    { authenticationsService, usersService, tokenManager, validator }
  ) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsService,
      usersService,
      tokenManager,
      validator
    );
    server.route(routes(authenticationsHandler));
  },
};
