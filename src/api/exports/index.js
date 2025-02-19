const ExportsHandler = require('./handler');
const routes = require('./routes');

/**
 * @type {import('../../types/HapiTypes').HapiPlugin}
 */
module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const exportsHandler = new ExportsHandler(service, validator);

    server.route(routes(exportsHandler));
  },
};
