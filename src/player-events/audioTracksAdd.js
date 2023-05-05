const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');

module.exports = {
  name: 'audioTracksAdd',
  /**
   * 
   * @param {import('discord-player').GuildQueue} queue 
   * @param {import('discord-player').Track[]} tracks
   */
  execute(queue, tracks) {
    // Emitted when the player adds multiple songs to its queue
    /**
     * @type {import('discord.js').CommandInteraction}
     */
    const metadata = queue.metadata;
    metadata.channel.send(createEmbedMessage(
      MessageType.Success,
      tracks[0].playlist?.title
        ? `Added ${tracks.length} tracks from playlist [${tracks[0].playlist?.title}](${tracks[0].playlist?.url}) to queue.`
        : `Added ${tracks.length} tracks to queue.`,
    ));
  },
};
