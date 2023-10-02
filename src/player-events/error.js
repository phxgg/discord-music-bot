const logger = require('../utils/logger');

module.exports = {
  name: 'error',
  /**
   * @param {import('discord-player').GuildQueue} queue 
   * @param {*} err 
   */
  async execute(queue, err) {
    // Emitted when the player queue encounters error
    logger.error(`Player queue error -> ${queue.guild.id}`, err);
  },
};
