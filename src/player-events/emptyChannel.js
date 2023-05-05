const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');

module.exports = {
  name: 'emptyChannel',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   */
  execute(queue) {
    // Emitted when the voice channel has been empty for the set threshold
    // Bot will automatically leave the voice channel with this event
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    metadata.channel.send(createEmbedMessage(MessageType.Info, 'Leaving because no vc activity for the past 5 minutes'));
  },
};
