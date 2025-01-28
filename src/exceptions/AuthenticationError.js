const CLientError = require('./ClientError');

class AuthenticationError extends CLientError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationsError';
  }
}

module.exports = AuthenticationError;
