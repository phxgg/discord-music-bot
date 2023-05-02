module.exports = {
  name: 'playerStart',
  execute(queue, track) {
    /**
     * @type {import('discord.js').Interaction}
     */
    const metadata = queue.metadata;
    metadata.channel.send(`Now playing ${track.title}!`);
  },
};
