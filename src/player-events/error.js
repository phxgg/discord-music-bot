module.exports = {
  name: 'error',
  execute(queue, err) {
    // Emitted when the player queue encounters error
    console.error(`General player error event: ${err.message}`);
    console.error(err);
  },
};
