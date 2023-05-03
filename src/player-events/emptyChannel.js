module.exports = {
  name: 'emptyChannel',
  execute(queue) {
    // Emitted when the voice channel has been empty for the set threshold
    // Bot will automatically leave the voice channel with this event
    /**
     * @type {import('discord.js').Interaction}
     */
    const metadata = queue.metadata;
    metadata.channel.send('Leaving because no vc activity for the past 5 minutes');
  },
};
