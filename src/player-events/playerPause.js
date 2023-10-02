const logger = require('../utils/logger');

module.exports = {
  name: 'playerPause',
  /**
   * @param {import('discord-player').GuildQueue} queue 
   * @param {import('discord-player').Track} track 
   */
  async execute(queue) {
    logger.info(`${queue.guild.id} -> playerPause event`);
    // Emitted when the audio player fails to load the stream for a song
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    /**
     * @type {import('../utils/trackBox')}
     */
    const trackbox = queue.trackbox;
    if (trackbox) {
      trackbox.playerPause();
    }
  },
};
