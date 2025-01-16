const CLientError = require('./ClientError');

class NotFoundError extends CLientError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
