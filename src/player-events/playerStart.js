const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');
const logger = require('../utils/logger');
const TrackBox = require('../utils/trackBox');

module.exports = {
  name: 'playerStart',
  /**
   * @param {import('discord-player').GuildQueue} queue 
   * @param {import('discord-player').Track} track
   */
  async execute(queue, track) {
    logger.info(`${queue.guild.id} -> playerStart event`);
    // Emitted when the player starts to play a song
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    if (process.env.ENABLE_TRACKBOX === 'true') {
      if (!queue.trackbox) {
        queue.trackbox = new TrackBox({
          channel: metadata.channel,
          queue: queue,
        });
      }
      queue.trackbox.start();
    } else {
      await metadata.channel.send(createEmbedMessage(MessageType.Info, `Now playing **[${track.title}](${track.url})**!`));
    }
  },
};
