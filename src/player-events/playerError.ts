import { GuildQueue, GuildQueueEvent } from 'discord-player';

import logger from '@/lib/logger.js';

export default {
  name: GuildQueueEvent.PlayerError,
  async execute(queue: GuildQueue, err: any) {
    // Emitted when the audio player errors while streaming audio track
    logger.error(`Player error event -> ${queue.guild.id}`, err);
  },
};
