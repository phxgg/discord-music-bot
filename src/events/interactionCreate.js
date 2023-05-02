const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  /**
   * 
   * @param {import('discord.js').Interaction} interaction 
   * @returns 
   */
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(err);
    }
  },
};
