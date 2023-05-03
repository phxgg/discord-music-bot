const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');

module.exports = {
  name: 'audioTrackAdd',
  /**
   * 
   * @param {*} queue 
   * @param {import('discord-player').Track} track
   */
  execute(queue, track) {
    // Emitted when the player adds a single song to its queue
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    metadata.channel.send(createEmbedMessage(MessageType.Success, `Added ${track.title} to queue.`));
  },
};
