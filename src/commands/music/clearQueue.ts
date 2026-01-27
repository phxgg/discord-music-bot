import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { useMainPlayer, useQueue } from 'discord-player';
import { IBaseCommand } from '@/commands/IBaseCommand';

import { MessageType } from '@/types/MessageType';
import logger from '@/lib/logger';
import { createEmbedMessage, parseError } from '@/lib/utils';
import inSameVoiceChannel from '@/middleware/inSameVoiceChannel';

export default class ClearQueueCommand implements IBaseCommand {
  data = new SlashCommandBuilder()
    .setName('clearqueue')
    .setDescription('Clear queue.');

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

    try {
      queue.clear();
      return interaction.reply(
        createEmbedMessage(MessageType.Info, 'Cleared queue.'),
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
