const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');
const TrackBox = require('../utils/trackBox');

module.exports = {
  name: 'playerStart',
  /**
   * 
   * @param {*} queue 
   * @param {import('discord-player').Track} track
   */
  execute(queue, track) {
    // Emitted when the player starts to play a song
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    metadata.channel.send(createEmbedMessage(MessageType.Info, `Now playing **${track.title}**!`));
    if (!queue.trackbox) {
      queue.trackbox = new TrackBox({
        channel: metadata.channel,
        queue: queue,
      });
    }
    queue.trackbox.start();
  },
};
