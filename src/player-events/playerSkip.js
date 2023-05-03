module.exports = {
  name: 'playerSkip',
  /**
   * 
   * @param {*} queue 
   * @param {import('discord-player').Track} track 
   */
  execute(queue, track) {
    // Emitted when the audio player fails to load the stream for a song
    /**
     * @type {import('discord.js').Interaction}
     */
    const metadata = queue.metadata;
    metadata.channel.send(`Skipping **${track.title}** due to an issue!`);
  },
};
