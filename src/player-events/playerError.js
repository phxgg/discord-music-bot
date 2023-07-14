const logger = require('../utils/logger');

module.exports = {
  name: 'playerError',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   * @param {*} err 
   */
  async execute(queue, err) {
    // Emitted when the audio player errors while streaming audio track
    logger.error(`Player error event -> ${queue.guild.id}`, err);
  },
};
