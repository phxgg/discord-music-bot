import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { IBaseCommand } from '@/commands/IBaseCommand';

export default class PingCommand implements IBaseCommand {
  data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!');

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Pong!');
  }
}
