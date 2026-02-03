import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Client } from 'discord.js';

import logger from '@/lib/logger.js';

const __dirname = import.meta.dirname;

export async function registerSlashCommands(client: Client) {
  const foldersPath = path.join(__dirname, '..', 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    // Construct the full path to the commands directory
    const commandsPath = path.join(foldersPath, folder);
    // Skip any non-directory files
    if (!fs.lstatSync(commandsPath).isDirectory()) {
      continue;
    }
    // Grab all the command files from the commands directory you created earlier
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);

      try {
        // Dynamically import the command module
        const fileUrl = pathToFileURL(filePath).href;
        const module = await import(fileUrl);
        if (module.default && typeof module.default === 'function') {
          const CommandClass = module.default;
          const command = new CommandClass();
          if ('data' in command && 'execute' in command) {
            client.commands?.set(command.data.name, command);
          } else {
            logger.warn(
              `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
            );
          }
        } else {
          logger.warn(
            `[WARNING] The module at ${filePath} does not export a valid command class.`,
          );
        }
      } catch (err) {
        logger.error(`[ERROR] Failed to load command at ${filePath}.`, err);
      }
    }
  }
}
