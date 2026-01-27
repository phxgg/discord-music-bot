import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { useMainPlayer, useQueue } from 'discord-player';
import { IBaseCommand } from '@/commands/IBaseCommand';

import { MessageType } from '@/types/MessageType';
import logger from '@/lib/logger';
import { createEmbedMessage, parseError } from '@/lib/utils';
import inSameVoiceChannel from '@/middleware/inSameVoiceChannel';

export default class PauseCommand implements IBaseCommand {
  data = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause/resume player.');

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
      queue.node.setPaused(!queue.node.isPaused());
      return interaction.reply(
        createEmbedMessage(
          MessageType.Info,
          `Player is now ${queue.node.isPaused() ? 'paused' : 'resumed'}.`,
        ),
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
