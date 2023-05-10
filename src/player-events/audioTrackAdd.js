const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');

module.exports = {
  name: 'audioTrackAdd',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   * @param {import('discord-player').Track} track
   */
  async execute(queue, track) {
    // Emitted when the player adds a single song to its queue
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    await metadata.channel.send(createEmbedMessage(MessageType.Success, `Added ${track.title} to queue.`));
  },
};
