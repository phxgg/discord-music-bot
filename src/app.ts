import 'dotenv/config';

import { Client, GatewayIntentBits, Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import logger from './utils/logger';

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise\n', p);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown\n');
    process.exit(1);
  });

// Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Command handling
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    (async () => {
      try {
        const module = await import(filePath);
        const command = module.default;
        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      } catch (err) {
        logger.error(`Failed to load command at ${filePath}`, err);
      }
    })()
  }
}

// Event handling
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);

  (async () => {
    try {
      const module = await import(filePath);
      const event = module.default;
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    } catch (error) {
      console.error(`Error loading event at ${filePath}:`, error);
    }
  })();
}

client.login(process.env.DISCORD_BOT_TOKEN).catch((err) => {
  logger.error('Failed to login to Discord.', err);
});
