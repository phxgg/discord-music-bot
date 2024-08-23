import { GuildQueue } from 'discord-player';

import logger from '../utils/logger';

export default {
  name: 'error',
  async execute(queue: GuildQueue, err: any) {
    // Emitted when the player queue encounters error
    logger.error(`Player queue error -> ${queue.guild.id}`, err);
  },
};
