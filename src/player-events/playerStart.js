module.exports = {
  name: 'playerStart',
  /**
   * 
   * @param {*} queue 
   * @param {import('discord-player').Track} track
   */
  execute(queue, track) {
    // Emitted when the player starts to play a song
    /**
     * @type {import('discord.js').Interaction}
     */
    const metadata = queue.metadata;
    metadata.channel.send(`Now playing **${track.title}**!`);
  },
};
