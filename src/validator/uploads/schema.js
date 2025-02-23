const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string()
    .valid(
      'image/apng',
      'image/avif',
      'image/gif',
      'image/jpg',
      'image/jpeg',
      'image/png',
      // eslint-disable-next-line comma-dangle
      'image/webp'
    )
    .required(),
}).unknown();

module.exports = { ImageHeadersSchema };
