const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');

module.exports = {
  name: 'playerSkip',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   * @param {import('discord-player').Track} track 
   */
  async execute(queue, track) {
    // Emitted when the audio player fails to load the stream for a song
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    await metadata.channel.send(createEmbedMessage(MessageType.Warning, `Skipping **${track.title}** due to an issue!`));
  },
};
