module.exports = {
  name: 'playerResume',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   * @param {import('discord-player').Track} track 
   */
  async execute(queue) {
    // Emitted when the audio player fails to load the stream for a song
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;

    /**
     * @type {import('../utils/trackBox').}
     */
    const trackbox = queue.trackbox;
    if (trackbox) {
      trackbox.playerResume();
    }
  },
};
