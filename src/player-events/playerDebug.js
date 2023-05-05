module.exports = {
  name: 'debug',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   * @param {*} message 
   */
  async execute(queue, message) {
    // Emitted when the player queue sends debug info
    // Useful for seeing what state the current queue is at
    // console.log(`Player debug event: ${message}`);
  },
};
