import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { useMainPlayer, useQueue } from 'discord-player';
import { IBaseCommand } from '@/commands/IBaseCommand.js';

import { MessageType } from '@/types/MessageType.js';
import logger from '@/lib/logger.js';
import { createEmbedMessage, parseError } from '@/lib/utils.js';
import inSameVoiceChannel from '@/middleware/inSameVoiceChannel.js';

export default class PreviousCommand implements IBaseCommand {
  data = new SlashCommandBuilder()
    .setName('previous')
    .setDescription('Play previous track.');

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
        createEmbedMessage(MessageType.Error, 'Nothing is playing!'),
      );
    }

    await interaction.deferReply();
    try {
      const previousTrack = queue.history.previousTrack;
      queue.history
        .previous()
        .then(async () => {
          interaction.editReply(
            createEmbedMessage(
              MessageType.Success,
              `**${previousTrack?.title}** enqueued!`,
            ),
          );
        })
        .catch(async (err) => {
          logger.error(`${interaction.guild!.id} -> ${err}`);
          interaction.editReply(
            createEmbedMessage(
              MessageType.Warning,
              parseError(err) || 'An error occurred!',
            ),
          );
        });
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
