module.exports = {
  name: 'debug',
  async execute(message) {
    // Emitted when the player sends debug info
    // Useful for seeing what dependencies, extractors, etc are loaded
    console.log(`General player debug event: ${message}`);
  },
};
