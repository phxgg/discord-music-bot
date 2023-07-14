const MessageType = require('../types/MessageType');
const cleanupQueue = require('../utils/cleanupQueue');
const createEmbedMessage = require('../utils/createEmbedMessage');
const logger = require('../utils/logger');

module.exports = {
  name: 'emptyChannel',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   */
  async execute(queue) {
    logger.info(`${queue.guild.id} -> emptyChannel emitted`);
    // Emitted when the voice channel has been empty for the set threshold
    // Bot will automatically leave the voice channel with this event
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    await cleanupQueue(queue);
    await metadata.channel.send(createEmbedMessage(MessageType.Info, 'Leaving because no vc activity for the past 5 minutes'));
  },
};
