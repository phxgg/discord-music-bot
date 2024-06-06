const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');
const logger = require('../utils/logger');

module.exports = {
  name: 'playerSkip',
  /**
   * @param {import('discord-player').GuildQueue} queue 
   * @param {import('discord-player').Track} track 
   */
  async execute(queue, track) {
    logger.info(`${queue.guild.id} -> playerSkip event`);
    // Emitted when the audio player fails to load the stream for a song
    // EDIT: This event is emitted when queue.node.skip() is called,
    // which means that this event is emitted when the player skips a track.
    // For this reason, we should not be sending a warning message here.
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    // await metadata.channel.send(createEmbedMessage(MessageType.Warning, `Skipping **[${track.title}](${track.url})** due to an issue!`));
  },
};
