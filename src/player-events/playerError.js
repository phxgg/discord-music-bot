module.exports = {
  name: 'playerError',
  execute(queue, err) {
    // Emitted when the audio player errors while streaming audio track
    console.error(`Player error event: ${err.message}`);
    console.error(err);
  },
};
