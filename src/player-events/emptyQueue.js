const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');

module.exports = {
  name: 'emptyQueue',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   */
  async execute(queue) {
    // Emitted when the player queue has finished
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    if (queue.trackbox) {
      await queue.trackbox.destroy();
    }
    delete queue.trackbox;
    await metadata.channel.send(createEmbedMessage(MessageType.Info, 'Queue finished!'));
  },
};
