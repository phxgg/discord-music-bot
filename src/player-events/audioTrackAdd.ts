import { GuildQueue, Track } from 'discord-player';
import logger from '../utils/logger';
import { CommandInteraction } from 'discord.js';

export default {
  name: 'audioTrackAdd',
  async execute(queue: GuildQueue, track: Track) {
    logger.info(`${queue.guild.id} -> audioTrackAdd event`);
    // Emitted when the player adds a single song to its queue
    const metadata = queue.metadata as CommandInteraction;
    // await metadata.channel.send(createEmbedMessage(MessageType.Success, `Added **[${track.title}](${track.url})** to queue.`));
  },
};
