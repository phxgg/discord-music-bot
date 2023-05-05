module.exports = {
  name: 'error',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   * @param {*} err 
   */
  execute(queue, err) {
    // Emitted when the player queue encounters error
    console.error(`General player error event: ${err.message}`);
    console.error(err);
  },
};
