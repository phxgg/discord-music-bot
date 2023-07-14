const logger = require('../utils/logger');

module.exports = {
  name: 'debug',
  async execute(message) {
    // Emitted when the player sends debug info
    // Useful for seeing what dependencies, extractors, etc are loaded
    logger.debug(`General player debug event ${message}`);
  },
};
