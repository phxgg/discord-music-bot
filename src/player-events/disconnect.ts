import { ChannelType, CommandInteraction } from 'discord.js';
import { GuildQueue, GuildQueueEvent } from 'discord-player';

import { MessageType } from '@/types/MessageType';
import { cleanupQueue, createEmbedMessage } from '@/utils/funcs';
import logger from '@/utils/logger';

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
