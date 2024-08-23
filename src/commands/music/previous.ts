import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { useMainPlayer, useQueue } from 'discord-player';
import { MessageType } from '../../types/MessageType';
import { createEmbedMessage } from '../../utils/funcs';
import logger from '../../utils/logger';
import { parseError } from '../../utils/funcs';
import inSameVoiceChannel from '../../middleware/inSameVoiceChannel';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('previous')
    .setDescription('Play previous track.'),
  middleware: [inSameVoiceChannel],
  async execute(interaction: ChatInputCommandInteraction) {
    const player = useMainPlayer();
    if (!player) {
      return interaction.reply(createEmbedMessage(MessageType.Warning, 'Player is not ready.'));
    }

    const queue = useQueue(interaction.guild!.id);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply(createEmbedMessage(MessageType.Error, 'Nothing is playing!'));
    }

    await interaction.deferReply();
    try {
      const previousTrack = queue.history.previousTrack;
      queue.history.previous()
        .then(async () => {
          interaction.editReply(createEmbedMessage(MessageType.Success, `**${previousTrack?.title}** enqueued!`));
        })
        .catch(async (err) => {
          logger.error(`${interaction.guild!.id} -> ${err}`);
          interaction.editReply(createEmbedMessage(MessageType.Warning, parseError(err) || 'An error occurred!'));
        });
    } catch (err) {
      logger.error(`${interaction.guild!.id} -> ${err}`);
      return interaction.editReply(createEmbedMessage(MessageType.Error, `Something went wrong: ${parseError(err)}`));
    }
  },
};
