require('module-alias/register');
require('dotenv').config();

const { REST, Routes } = require('discord.js');

if (!process.env.APPLICATION_ID || !process.env.DISCORD_BOT_TOKEN) {
  console.error('[ERROR] Missing required environment variables.');
  process.exit(1);
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    // The put method is used to fully refresh all global commands with the current set
    await rest.put(
      Routes.applicationCommands(process.env.APPLICATION_ID),
      { body: [] },
    );

    console.log('Successfully unregistered all application (/) commands.');
  } catch (err) {
    // And of course, make sure you catch and log any errors!
    console.error(err);
  }
})();
