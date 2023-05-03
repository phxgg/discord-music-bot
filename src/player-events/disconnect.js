const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');

module.exports = {
  name: 'disconnect',
  execute(queue) {
    // Emitted when the bot leaves the voice channel
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    metadata.channel.send(createEmbedMessage(MessageType.Info, 'Looks like my job here is done, leaving now!'));
  },
};
