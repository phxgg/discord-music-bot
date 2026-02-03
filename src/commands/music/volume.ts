import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { useMainPlayer, useQueue, useTimeline } from 'discord-player';
import { IBaseCommand } from '@/commands/IBaseCommand.js';

import { MessageType } from '@/types/MessageType.js';
import logger from '@/lib/logger.js';
import { createEmbedMessage, parseError } from '@/lib/utils.js';
import inSameVoiceChannel from '@/middleware/inSameVoiceChannel.js';

export default class VolumeCommand implements IBaseCommand {
  data = new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjust the player volume.')
    .addNumberOption((option) =>
      option
        .setName('value')
        .setDescription('Volume level')
        .setRequired(true)
        .setMaxValue(100)
        .setMinValue(0),
    );

  middleware = [inSameVoiceChannel];

  /**
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction: ChatInputCommandInteraction) {
    const player = useMainPlayer();
    if (!player) {
      return interaction.reply(
        createEmbedMessage(MessageType.Warning, 'Player is not ready.'),
      );
    }

    const queue = useQueue(interaction.guild!.id);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply(
        createEmbedMessage(MessageType.Warning, 'There is no queue.'),
      );
    }

    const timeline = useTimeline({ node: interaction.guild!.id });
    if (!timeline) {
      return interaction.reply(
        createEmbedMessage(MessageType.Warning, 'Timeline is not ready.'),
      );
    }

    try {
      // const value = interaction.options.getString('value', true); // we need input/query to play
      const value = interaction.options.getNumber('value', true);
      timeline.setVolume(value);
      return interaction.reply(
        createEmbedMessage(MessageType.Info, `Volume set to ${value}.`),
      );
    } catch (err) {
      logger.error(`${interaction.guild!.id} -> ${err}`);
      return interaction.reply(
        createEmbedMessage(
          MessageType.Error,
          `Something went wrong: ${parseError(err)}`,
        ),
      );
    }
  }
}
