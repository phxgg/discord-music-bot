import { GuildQueue, GuildQueueEvent } from 'discord-player';

import logger from '@/utils/logger';

export default {
  name: GuildQueueEvent.Debug,
  async execute(queue: GuildQueue, message: any) {
    // Emitted when the player queue sends debug info
    // Useful for seeing what state the current queue is at
    logger.debug(`Player debug event -> ${queue.guild.id} -> ${message}`);
  },
};
