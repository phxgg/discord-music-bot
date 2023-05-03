module.exports = {
  name: 'emptyQueue',
  execute(queue) {
    // Emitted when the player queue has finished
    /**
     * @type {import('discord.js').Interaction}
     */
    const metadata = queue.metadata;
    metadata.channel.send('Queue finished!');
  },
};
