import { ActivityType, Client, Events } from "discord.js";
import logger from "../utils/logger";
import { Player, PlayerInitOptions } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { registerPlayerEvents } from "../init/registerPlayerEvents";

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
    const playerOptions: Omit<PlayerInitOptions, 'ignoreInstance'> = {
      skipFFmpeg: false,
      useLegacyFFmpeg: false,
    };
    if (process.env.ENABLE_IP_ROTATION === 'true') {
      const ipv6Blocks = process.env.IPV6_BLOCKS?.split(' ');
      Object.assign(playerOptions, {
        ipconfig: {
          blocks: ipv6Blocks,
        },
      });
    }

    // Initialize discord player
    const player = Player.singleton(client, playerOptions);
    try {
      // await player.extractors.loadDefault();
      await player.extractors.register(YoutubeiExtractor, {
        authentication: process.env.YT_EXTRACTOR_AUTH || '',
        streamOptions: {
          useClient: 'iOS',
          highWaterMark: 2 * 1024 * 1024, // 2MB, default is 512 KB (512 * 1024)
        },
      });
      // load all default extractors except YouTubeExtractor since we are using YoutubeiExtractor
      await player.extractors.loadDefault((ext) => !['YouTubeExtractor'].includes(ext));
    } catch (err) {
      logger.error('Failed to register extractors.', err);
      process.exit(1);
    }

    // Register Player Events
    await registerPlayerEvents(player);
  },
};
