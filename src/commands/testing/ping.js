const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),
  /**
   * 
   * @param {import('discord.js').Interaction} interaction 
   */
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
