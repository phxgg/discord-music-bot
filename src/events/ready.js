const fs = require('node:fs');
const path = require('node:path');
const { Player } = require('discord-player');
const { Events, ActivityType } = require('discord.js');
const logger = require('../utils/logger');
const { YoutubeiExtractor } = require('discord-player-youtubei');

module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
   * This event runs once when the client starts.
   * @param {import('discord.js').Client} client
   * @returns {Promise<void>}
   */
  async execute(client) {
    logger.info(`Logged in as ${client.user.tag}`);
    client.user.setActivity('music', { type: ActivityType.Listening });

    // Player options
    /**
     * @type {Omit<import('discord-player').PlayerInitOptions, 'ignoreInstance'>}
     */
    const playerOptions = {
      skipFFmpeg: false,
      useLegacyFFmpeg: false,
    };
    if (process.env.ENABLE_IP_ROTATION === 'true') {
      const ipv6Blocks = process.env.IPV6_BLOCKS.split(' ');
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
      const event = require(filePath);
      player.events.on(event.name, (...args) => event.execute(...args));
    }
  },
};
