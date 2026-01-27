import { ChannelType, CommandInteraction } from 'discord.js';
import { GuildQueue, GuildQueueEvent } from 'discord-player';

import { MessageType } from '@/types/MessageType';
import logger from '@/lib/logger';
import { cleanupQueue, createEmbedMessage } from '@/lib/utils';

export default {
  name: GuildQueueEvent.EmptyQueue,
  async execute(queue: GuildQueue) {
    logger.info(`${queue.guild.id} -> emptyQueue event`);
    // Emitted when the player queue has finished
    const metadata = queue.metadata as CommandInteraction;
    await cleanupQueue(queue);
    if (metadata.channel?.type === ChannelType.GuildText) {
      await metadata.channel?.send(
        createEmbedMessage(MessageType.Info, 'Queue finished!'),
      );
    }
  },
};
