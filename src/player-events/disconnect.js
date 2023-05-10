const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');

module.exports = {
  name: 'disconnect',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   */
  async execute(queue) {
    // Emitted when the bot leaves the voice channel
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    await metadata.channel.send(createEmbedMessage(MessageType.Info, 'Looks like my job here is done, leaving now!'));
  },
};
