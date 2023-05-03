module.exports = {
  name: 'audioTrackAdd',
  /**
   * 
   * @param {*} queue 
   * @param {import('discord-player').Track} track
   */
  execute(queue, track) {
    // Emitted when the player adds a single song to its queue
    /**
     * @type {import('discord.js').Interaction}
     */
    const metadata = queue.metadata;
    metadata.channel.send(`Track **${track.title}** queued`);
  },
};
