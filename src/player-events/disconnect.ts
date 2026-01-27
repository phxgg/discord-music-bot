import { ChannelType, CommandInteraction } from 'discord.js';
import { GuildQueue, GuildQueueEvent } from 'discord-player';

import { MessageType } from '@/types/MessageType';
import logger from '@/lib/logger';
import { cleanupQueue, createEmbedMessage } from '@/lib/utils';

export default {
  name: GuildQueueEvent.Disconnect,
  async execute(queue: GuildQueue) {
    logger.info(`${queue.guild.id} -> disconnect event`);
    // Emitted when the bot leaves the voice channel
    const metadata = queue.metadata as CommandInteraction;
    await cleanupQueue(queue);
    if (metadata.channel?.type === ChannelType.GuildText) {
      await metadata.channel?.send(
        createEmbedMessage(
          MessageType.Info,
          'Looks like my job here is done, leaving now!',
        ),
      );
    }
  },
};
