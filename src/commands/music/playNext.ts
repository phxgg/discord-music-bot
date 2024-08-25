import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { useMainPlayer, useQueue } from 'discord-player';

import inVoiceChannel from '../../middleware/inVoiceChannel';
import { MessageType } from '../../types/MessageType';
import { createEmbedMessage, parseError } from '../../utils/funcs';
import logger from '../../utils/logger';

export default {
  data: new SlashCommandBuilder()
    .setName('playnext')
    .setDescription('Insert a track at the top of the queue.')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('The song to insert')
        .setAutocomplete(true)
        .setRequired(true),
    ),
  middleware: [inVoiceChannel],
  async execute(interaction: ChatInputCommandInteraction) {
    const player = useMainPlayer();
    if (!player) {
      return interaction.reply(
        createEmbedMessage(MessageType.Warning, 'Player is not ready.'),
      );
    }

    const query = interaction.options.getString('query', true); // we need input/query to play

    const queue = useQueue(interaction.guild!.id);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply(
        createEmbedMessage(MessageType.Error, 'Nothing is playing!'),
      );
    }

    await interaction.deferReply();
    try {
      const search = await player.search(query, {
        requestedBy: interaction.user,
      });
      if (!search || search.tracks.length === 0) {
        return interaction.editReply(
          createEmbedMessage(MessageType.Error, 'No results found!'),
        );
      }

      queue.insertTrack(search.tracks[0], 0);
      return interaction.editReply(
        createEmbedMessage(
          MessageType.Info,
          `**${search.tracks[0].title}** queued up next!`,
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
  // autcomplete function is the same as in the play command, so we can import it from there
  async autocomplete(interaction: AutocompleteInteraction) {
    return (await import('./play')).default.autocomplete(interaction);
  },
};
