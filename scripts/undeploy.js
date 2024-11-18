require('module-alias/register');
require('dotenv').config();

const { REST, Routes } = require('discord.js');

const guildId = process.env.GUILD_ID || process.argv[2];

if (!guildId) {
  console.error('[ERROR] Missing required guild id.');
  process.exit(1);
}

if (!process.env.APPLICATION_ID || !process.env.DISCORD_BOT_TOKEN) {
  console.error('[ERROR] Missing required environment variables.');
  process.exit(1);
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    // The put method is used to fully refresh all commands in the guild with the current set
    await rest.put(
      Routes.applicationGuildCommands(process.env.APPLICATION_ID, guildId),
      { body: [] },
    );

    console.log('Successfully unregistered all guild (/) commands.');
  } catch (err) {
    // And of course, make sure you catch and log any errors!
    console.error(err);
  }
})();
