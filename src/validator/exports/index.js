const { exportNotesPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ExportsValidator = {
  /**
   * @param {{targetEmail: string}} payload
   * @returns {void}
   * @throws {InvariantError}
   */
  validateExportNotesPayload: (payload) => {
    const { error } = exportNotesPayloadSchema.validate(payload);

    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

module.exports = ExportsValidator;
