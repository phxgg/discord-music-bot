import { ActivityType, Client, Events } from "discord.js";
import logger from "../utils/logger";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import path from "path";
import fs from "fs";

export default {
  name: Events.ClientReady,
  once: true,
  /**
   * This event runs once when the client starts.
   * @param {import('discord.js').Client} client
   * @returns {Promise<void>}
   */
  async execute(client: Client) {
    logger.info(`Logged in as ${client.user?.tag}`);
    client.user?.setActivity('music', { type: ActivityType.Listening });

    // Player options
    /**
     * @type {Omit<import('discord-player').PlayerInitOptions, 'ignoreInstance'>}
     */
    const playerOptions = {
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

    // Player event handling
    const playerEventsPath = path.join(__dirname, '../player-events');
    const playerEventFiles = fs.readdirSync(playerEventsPath).filter(file => file.endsWith('.js'));

    for (const file of playerEventFiles) {
      const filePath = path.join(playerEventsPath, file);
      (async () => {
        try {
          const module = await import(filePath);
          const event = module.default;
          player.events.on(event.name, (...args: any) => event.execute(...args));
        } catch (error) {
          console.error(`Error loading player event at ${filePath}:`, error);
        }
      })();
    }
  },
};
