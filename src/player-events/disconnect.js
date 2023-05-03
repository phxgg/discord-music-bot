module.exports = {
  name: 'disconnect',
  execute(queue) {
    // Emitted when the bot leaves the voice channel
    /**
     * @type {import('discord.js').Interaction}
     */
    const metadata = queue.metadata;
    metadata.channel.send('Looks like my job here is done, leaving now!');
  },
};
