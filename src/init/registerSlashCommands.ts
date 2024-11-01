import fs from 'fs';
import path from 'path';
import { Client } from 'discord.js';

import logger from '@/utils/logger';

export async function registerSlashCommands(client: Client) {
  const foldersPath = path.join(__dirname, '..', 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);

      try {
        const module = await import(filePath);
        const command = module.default;

        if ('data' in command && 'execute' in command) {
          client.commands?.set(command.data.name, command);
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
          );
        }
      } catch (err) {
        logger.error(`Failed to load command at ${filePath}`, err);
      }
    }
  }
}
