const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');
const TrackBox = require('../utils/trackBox');

module.exports = {
  name: 'playerStart',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   * @param {import('discord-player').Track} track
   */
  execute(queue, track) {
    // Emitted when the player starts to play a song
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    if (process.env.ENABLE_TRACKBOX) {
      if (!queue.trackbox) {
        queue.trackbox = new TrackBox({
          channel: metadata.channel,
          queue: queue,
        });
      }
      queue.trackbox.start();
    } else {
      metadata.channel.send(createEmbedMessage(MessageType.Info, `Now playing **${track.title}**!`));
    }
  },
};
