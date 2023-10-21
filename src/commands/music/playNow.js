const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');
const logger = require('../../utils/logger');
const { parseError } = require('../../utils/funcs');
const inVoiceChannel = require('../../middleware/inVoiceChannel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playnow')
    .setDescription('Insert a track at the top of the queue and skip current track.')
    .addStringOption(option => option.setName('query').setDescription('The song to play').setRequired(true)),
  middleware: [inVoiceChannel],
  /**
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    const player = useMainPlayer();
    if (!player) {
      return interaction.reply(createEmbedMessage(MessageType.Warning, 'Player is not ready.'));
    }

    const query = interaction.options.getString('query', true); // we need input/query to play

    const queue = useQueue(interaction.guild.id);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply(createEmbedMessage(MessageType.Error, 'Nothing is playing!'));
    }

    await interaction.deferReply();
    try {
      const search = await player.search(query, { requestedBy: interaction.user });
      if (!search || search.tracks.length === 0) {
        return interaction.editReply(createEmbedMessage(MessageType.Error, 'No results found!'));
      }

      queue.insertTrack(search.tracks[0], 0);
      queue.node.skip();
      return interaction.editReply(createEmbedMessage(MessageType.Info, `**${search.tracks[0].title}** playing now!`));
    } catch (err) {
      logger.error(`${interaction.guild.id} -> ${err}`);
      return interaction.editReply(createEmbedMessage(MessageType.Error, `Something went wrong: ${parseError(err)}`));
    }
  },
};
