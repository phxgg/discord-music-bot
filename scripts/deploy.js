require('module-alias/register');
require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const guildId = process.env.GUILD_ID || process.argv[2];

if (!guildId) {
  console.error('[ERROR] Missing required guild id.');
  process.exit(1);
}

if (!process.env.APPLICATION_ID || !process.env.DISCORD_BOT_TOKEN || !guildId) {
  console.error('[ERROR] Missing required environment variables.');
  process.exit(1);
}

const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, '..', 'dist', 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Construct the full path to the commands directory
  const commandsPath = path.join(foldersPath, folder);
  // Skip any non-directory files
  if (!fs.lstatSync(commandsPath).isDirectory()) {
    continue;
  }
  // Grab all the command files from the commands directory you created earlier
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const module = require(filePath);
    const command = module.default;
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

// and deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} guild (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.APPLICATION_ID, guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} guild (/) commands.`);
  } catch (err) {
    // And of course, make sure you catch and log any errors!
    console.error(err);
  }
})();
