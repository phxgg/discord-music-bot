require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { SpotifyExtractor, SoundCloudExtractor } = require('@discord-player/extractor');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.player = new Player(client);
(async () => {
  try {
    await client.player.extractors.loadDefault();
  } catch (err) {
    console.error('Failed to load default extractors.');
    console.error(err);
    process.exit(1);
  }
})();

// Player events
const playerEventsPath = path.join(__dirname, 'player-events');
const playerEventFiles = fs.readdirSync(playerEventsPath).filter(file => file.endsWith('.js'));

for (const file of playerEventFiles) {
  const filePath = path.join(playerEventsPath, file);
  const event = require(filePath);
  client.player.events.on(event.name, (...args) => event.execute(...args));
}

// Command handling
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Event handling
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.DISCORD_BOT_TOKEN);
