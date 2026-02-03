import { CommandInteraction } from 'discord.js';
import { GuildQueue, GuildQueueEvent } from 'discord-player';

import logger from '@/lib/logger.js';
import TrackBox from '@/lib/trackBox.js';

export default {
  name: GuildQueueEvent.PlayerResume,
  async execute(queue: GuildQueue) {
    logger.info(`${queue.guild.id} -> playerResume event`);
    // Emitted when the audio player fails to load the stream for a song
    const metadata = queue.metadata as CommandInteraction;

    const trackbox = queue.trackbox as TrackBox;
    if (trackbox) {
      trackbox.playerResume();
    }
  },
};
