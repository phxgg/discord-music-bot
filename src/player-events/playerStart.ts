import {
  ChannelType,
  CommandInteraction,
  GuildTextBasedChannel,
} from 'discord.js';
import { GuildQueue, Track } from 'discord-player';

import { MessageType } from '../types/MessageType';
import { createEmbedMessage } from '../utils/funcs';
import logger from '../utils/logger';
import TrackBox from '../utils/trackBox';

export default {
  name: 'playerStart',
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
