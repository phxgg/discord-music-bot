const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');
const logger = require('../utils/logger');

module.exports = {
  name: 'audioTrackAdd',
  /**
   * @param {import('discord-player').GuildQueue} queue 
   * @param {import('discord-player').Track} track
   */
  async execute(queue, track) {
    logger.info(`${queue.guild.id} -> audioTrackAdd event`);
    // Emitted when the player adds a single song to its queue
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    // await metadata.channel.send(createEmbedMessage(MessageType.Success, `Added **[${track.title}](${track.url})** to queue.`));
  },
};
