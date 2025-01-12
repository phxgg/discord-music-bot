import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { useMainPlayer, useQueue } from 'discord-player';
import { IBaseCommand } from '@/commands/IBaseCommand';

import { MessageType } from '@/types/MessageType';
import { createEmbedMessage, parseError } from '@/utils/funcs';
import logger from '@/utils/logger';
import inSameVoiceChannel from '@/middleware/inSameVoiceChannel';

export default class ShuffleCommand implements IBaseCommand {
  data = new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle the queue.');

  middleware = [inSameVoiceChannel];

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

    await interaction.deferReply();
    try {
      queue.tracks.shuffle();
      return interaction.editReply(
        createEmbedMessage(MessageType.Info, 'Shuffled queue.'),
      );
    } catch (err) {
      logger.error(`${interaction.guild!.id} -> ${err}`);
      return interaction.editReply(
        createEmbedMessage(
          MessageType.Error,
          `Something went wrong: ${parseError(err)}`,
        ),
      );
    }
  }
}
