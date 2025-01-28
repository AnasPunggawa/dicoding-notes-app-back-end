const CLientError = require('./ClientError');

class AuthorizationError extends CLientError {
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
