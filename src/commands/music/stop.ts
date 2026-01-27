import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { useMainPlayer, useQueue } from 'discord-player';
import { IBaseCommand } from '@/commands/IBaseCommand';

import { MessageType } from '@/types/MessageType';
import logger from '@/lib/logger';
import { createEmbedMessage, parseError } from '@/lib/utils';
import inSameVoiceChannel from '@/middleware/inSameVoiceChannel';

export default class StopCommand implements IBaseCommand {
  data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop player and clear queue.');

  middleware = [inSameVoiceChannel];

  async execute(interaction: ChatInputCommandInteraction) {
    const player = useMainPlayer();
    if (!player) {
      return interaction.reply(
        createEmbedMessage(MessageType.Warning, 'Player is not ready.'),
      );
    }

    const queue = useQueue(interaction.guild!.id);
    if (!queue) {
      return interaction.reply(
        createEmbedMessage(MessageType.Warning, 'There is no queue.'),
      );
    }

    try {
      queue.delete();
      return interaction.reply(
        createEmbedMessage(MessageType.Info, 'Stopped player'),
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
