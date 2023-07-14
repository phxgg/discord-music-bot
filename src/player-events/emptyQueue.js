const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');
const cleanupQueue = require('../utils/cleanupQueue');
const logger = require('../utils/logger');

module.exports = {
  name: 'emptyQueue',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   */
  async execute(queue) {
    logger.info(`${queue.guild.id} -> emptyQueue emitted`);
    // Emitted when the player queue has finished
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    await cleanupQueue(queue);
    await metadata.channel.send(createEmbedMessage(MessageType.Info, 'Queue finished!'));
  },
};
