const UploadsHandler = require('./handler');
const routes = require('./routes');

/**
 * @type {import('../../types/HapiTypes').HapiPlugin}
 */
module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: (server, { service, validator }) => {
    const uploadsHandler = new UploadsHandler(service, validator);

    server.route(routes(uploadsHandler));
  },
};
