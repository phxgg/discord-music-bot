const fs = require('node:fs');
const path = require('node:path');
const { Player } = require('discord-player');
const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
   * 
   * @param {import('discord.js').Client} client 
   * @returns 
   */
  execute(client) {
    console.log(`Logged in as ${client.user.tag}`);

    // Initialize discord player
    // TODO: See what player options we can use
    const player = Player.singleton(client);
    (async () => {
      try {
        await player.extractors.loadDefault();
      } catch (err) {
        console.error('Failed to load default extractors.');
        console.error(err);
        process.exit(1);
      }
    })();

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
