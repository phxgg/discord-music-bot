import 'dotenv/config';

import { Client, GatewayIntentBits, Collection } from 'discord.js';
import logger from './utils/logger';
import { registerSlashCommands } from './init/registerSlashCommands';
import { registerClientEvents } from './init/registerClientEvents';

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise\n', p);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown\n');
    process.exit(1);
  });

(async () => {
  try {
    // Discord client
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });

    // Register Slash Commands
    client.commands = new Collection();
    await registerSlashCommands(client);

    // Register Client Events
    await registerClientEvents(client);

    client.login(process.env.DISCORD_BOT_TOKEN).catch((err) => {
      logger.error('Failed to login to Discord.', err);
    });
  } catch (err) {
    logger.error('Failed to initialize the bot.', err);
  }
})()
