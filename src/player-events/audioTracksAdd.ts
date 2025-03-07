import { ChannelType, CommandInteraction } from 'discord.js';
import { GuildQueue, GuildQueueEvent, Track } from 'discord-player';

import { MessageType } from '@/types/MessageType';
import { createEmbedMessage } from '@/utils/funcs';
import logger from '@/utils/logger';

export default {
  name: GuildQueueEvent.AudioTracksAdd,
  async execute(queue: GuildQueue, tracks: Track[]) {
    logger.info(`${queue.guild.id} -> audioTracksAdd event`);
    // Emitted when the player adds multiple songs to its queue
    const metadata = queue.metadata as CommandInteraction;
    // Check if the channel is a guild text channel
    if (metadata.channel?.type === ChannelType.GuildText) {
      await metadata.channel?.send(
        createEmbedMessage(
          MessageType.Success,
          tracks[0].playlist?.title
            ? `Added ${tracks.length} tracks from playlist **[${tracks[0].playlist?.title}](${tracks[0].playlist?.url})** to queue.`
            : `Added ${tracks.length} tracks to queue.`,
        ),
      );
    }
  },
};
