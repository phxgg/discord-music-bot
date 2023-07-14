const MessageType = require('../types/MessageType');
const cleanupQueue = require('../utils/cleanupQueue');
const createEmbedMessage = require('../utils/createEmbedMessage');
const logger = require('../utils/logger');

module.exports = {
  name: 'disconnect',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   */
  async execute(queue) {
    logger.info(`${queue.guild.id} -> disconnect event`);
    // Emitted when the bot leaves the voice channel
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    await cleanupQueue(queue);
    await metadata.channel.send(createEmbedMessage(MessageType.Info, 'Looks like my job here is done, leaving now!'));
  },
};
