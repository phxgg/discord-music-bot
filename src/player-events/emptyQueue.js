const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');

module.exports = {
  name: 'emptyQueue',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   */
  execute(queue) {
    // Emitted when the player queue has finished
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    metadata.channel.send(createEmbedMessage(MessageType.Info, 'Queue finished!'));
    if (queue.trackbox) {
      queue.trackbox.destroy();
    }
    delete queue.trackbox;
  },
};
