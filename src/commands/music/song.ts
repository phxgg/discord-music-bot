import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { useMainPlayer, useQueue } from 'discord-player';
import { MessageType } from '../../types/MessageType';
import { createEmbedMessage } from '../../utils/funcs';
import logger from '../../utils/logger';
import { parseError } from '../../utils/funcs';

export default {
  data: new SlashCommandBuilder()
    .setName('song')
    .setDescription('View current playing song.'),
  async execute(interaction: ChatInputCommandInteraction) {
    const player = useMainPlayer();
    if (!player) {
      return interaction.reply(createEmbedMessage(MessageType.Warning, 'Player is not ready.'));
    }

    const queue = useQueue(interaction.guild!.id);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply(createEmbedMessage(MessageType.Error, 'Nothing is playing!'));
    }

    try {
      const currentTrack = queue.currentTrack;
      return interaction.reply(createEmbedMessage(MessageType.Success, `Current track is **[${currentTrack?.title}](${currentTrack?.url})** by **${currentTrack?.author}**!`));
    } catch (err) {
      logger.error(`${interaction.guild!.id} -> ${err}`);
      return interaction.reply(createEmbedMessage(MessageType.Error, `Something went wrong: ${parseError(err)}`));
    }
  },
};
