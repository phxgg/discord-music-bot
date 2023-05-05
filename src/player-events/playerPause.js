module.exports = {
  name: 'playerPause',
  /**
   * 
   * @param {*} queue 
   * @param {import('discord-player').Track} track 
   */
  execute(queue) {
    // Emitted when the audio player fails to load the stream for a song
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    if (queue.trackbox) {
      queue.trackbox.updatePauseButton();
      queue.trackbox.updateMessageComponents();
    }
  },
};
