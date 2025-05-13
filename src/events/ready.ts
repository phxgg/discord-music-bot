import { ActivityType, Client, Events } from 'discord.js';
import { Player, PlayerInitOptions } from 'discord-player';
import { registerPlayerEvents } from '@/init/registerPlayerEvents';
import { DefaultExtractors } from '@discord-player/extractor';
import { YoutubeiExtractor } from 'discord-player-youtubei';

import logger from '@/utils/logger';

export default {
  name: Events.ClientReady,
  once: true,
  /**
   * This event runs once when the client starts.
   */
  async execute(client: Client) {
    logger.info(`Logged in as ${client.user?.tag}`);
    client.user?.setActivity('music', { type: ActivityType.Listening });

    // Player options
    const playerOptions: PlayerInitOptions = {
      skipFFmpeg: false,
    };
    // if (process.env.ENABLE_IP_ROTATION === 'true') {
    //   const ipv6Blocks = process.env.IPV6_BLOCKS?.split(' ');
    //   Object.assign(playerOptions, {
    //     ipconfig: {
    //       blocks: ipv6Blocks,
    //     },
    //   });
    // }

    // Initialize discord player
    const player = new Player(client, playerOptions);
    try {
      await player.extractors.register(YoutubeiExtractor, {
        // https://github.com/retrouser955/discord-player-youtubei?tab=readme-ov-file#signing-into-youtube
        // authentication: process.env.YT_EXTRACTOR_AUTH || '',
        cookie: process.env.YT_EXTRACTOR_AUTH || '',
        streamOptions: {
          useClient: 'IOS',
          highWaterMark: 2 * 1024 * 1024, // 2MB, default is 512 KB (512 * 1024)
        },
      });
      // load all default extractors
      await player.extractors.loadMulti(DefaultExtractors);
    } catch (err) {
      logger.error('Failed to register extractors.', err);
      process.exit(1);
    }

    // Register Player Events
    await registerPlayerEvents(player);
  },
};
