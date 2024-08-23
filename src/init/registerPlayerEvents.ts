import fs from 'fs';
import path from 'path';
import { Player } from 'discord-player';

export async function registerPlayerEvents(player: Player) {
  const playerEventsPath = path.join(__dirname, '..', 'player-events');
  const playerEventFiles = fs
    .readdirSync(playerEventsPath)
    .filter((file) => file.endsWith('.js'));

  for (const file of playerEventFiles) {
    const filePath = path.join(playerEventsPath, file);
    try {
      const module = await import(filePath);
      const event = module.default;
      player.events.on(event.name, (...args: any) => event.execute(...args));
    } catch (error) {
      console.error(`Error loading player event at ${filePath}:`, error);
    }
  }
}
