import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { useMainPlayer, useQueue } from 'discord-player';

import { MessageType } from '@/types/MessageType';
import { createEmbedMessage, parseError } from '@/utils/funcs';
import logger from '@/utils/logger';
import inSameVoiceChannel from '@/middleware/inSameVoiceChannel';

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip current track.'),
  middleware: [inSameVoiceChannel],
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
      const currentTrack = queue.currentTrack;
      queue.node.skip();
      return interaction.editReply(
        createEmbedMessage(
          MessageType.Info,
          `Skipped **[${currentTrack?.title}](${currentTrack?.url})**!`,
        ),
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
  },
};
