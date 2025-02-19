const Joi = require('joi');

const exportNotesPayloadSchema = Joi.object({
  // @ts-ignore
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = { exportNotesPayloadSchema };
