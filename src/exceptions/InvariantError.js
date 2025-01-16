const CLientError = require('./ClientError');

class InvariantError extends CLientError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
