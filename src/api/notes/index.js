const NotesHandler = require('./handler');
const routes = require('./routes');

/**
 * @type {import('../../types/hapiTypes.js').HapiPlugin}
 */
module.exports = {
  name: 'notes',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const notesHandler = new NotesHandler(service, validator);
    server.route(routes(notesHandler));
  },
};
