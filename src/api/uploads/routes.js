/**
 * @param {import('./handler.js')} handler
 * @returns {import('../../types/HapiTypes.js').HapiRoute}
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/upload/images',
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/images/{image*}',
    handler: handler.getUploadImageHandler,
  },
];

module.exports = routes;
