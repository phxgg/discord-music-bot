const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');

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
  },
};
