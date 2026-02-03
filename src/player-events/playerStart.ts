import {
  ChannelType,
  CommandInteraction,
  GuildTextBasedChannel,
} from 'discord.js';
import { GuildQueue, GuildQueueEvent, Track } from 'discord-player';

import { MessageType } from '@/types/MessageType.js';
import logger from '@/lib/logger.js';
import TrackBox from '@/lib/trackBox.js';
import { createEmbedMessage } from '@/lib/utils.js';

export default {
  name: GuildQueueEvent.PlayerStart,
  async execute(queue: GuildQueue, track: Track) {
    logger.info(`${queue.guild.id} -> playerStart event`);
    // Emitted when the player starts to play a song
    const metadata = queue.metadata as CommandInteraction;
    if (process.env.ENABLE_TRACKBOX === 'true') {
      if (!queue.trackbox) {
        queue.trackbox = new TrackBox({
          channel: metadata.channel! as GuildTextBasedChannel,
          queue: queue,
        });
      }
      queue.trackbox.start();
    } else {
      if (metadata.channel?.type === ChannelType.GuildText) {
        await metadata.channel?.send(
          createEmbedMessage(
            MessageType.Info,
            `Now playing **[${track.title}](${track.url})**!`,
          ),
        );
      }
    }
  },
};
