import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Client } from 'discord.js';

const __dirname = import.meta.dirname;

export async function registerClientEvents(client: Client) {
  const eventsPath = path.join(__dirname, '..', 'events');
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);

    try {
      const fileUrl = pathToFileURL(filePath).href;
      const module = await import(fileUrl);
      const event = module.default;

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    } catch (error) {
      console.error(`Error loading event at ${filePath}:`, error);
    }
  }
}
