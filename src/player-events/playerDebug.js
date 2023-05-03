module.exports = {
  name: 'debug',
  async execute(queue, message) {
    // Emitted when the player queue sends debug info
    // Useful for seeing what state the current queue is at
    // console.log(`Player debug event: ${message}`);
  },
};
