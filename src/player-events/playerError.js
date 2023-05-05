module.exports = {
  name: 'playerError',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   * @param {*} err 
   */
  execute(queue, err) {
    // Emitted when the audio player errors while streaming audio track
    console.error(`Player error event: ${err.message}`);
    console.error(err);
  },
};
