import { ChannelType, CommandInteraction } from 'discord.js';
import { GuildQueue, GuildQueueEvent } from 'discord-player';

import { MessageType } from '@/types/MessageType';
import { cleanupQueue, createEmbedMessage } from '@/utils/funcs';
import logger from '@/utils/logger';

export default {
  name: GuildQueueEvent.EmptyChannel,
  async execute(queue: GuildQueue) {
    logger.info(`${queue.guild.id} -> emptyChannel event`);
    // Emitted when the voice channel has been empty for the set threshold
    // Bot will automatically leave the voice channel with this event
    const metadata = queue.metadata as CommandInteraction;
    await cleanupQueue(queue);
    if (metadata.channel?.type === ChannelType.GuildText) {
      await metadata.channel?.send(
        createEmbedMessage(
          MessageType.Info,
          'Leaving because no vc activity for the past 1 minute.',
        ),
      );
    }
  },
};
