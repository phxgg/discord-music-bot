const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');
const logger = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playnext')
    .setDescription('Insert a track at the top of the queue.')
    .addStringOption(option => option.setName('query').setDescription('The song to insert').setRequired(true)),
  /**
   * @param {import('discord.js').CommandInteraction} interaction 
   */
  async execute(interaction) {
    const player = useMainPlayer();
    if (!player) {
      return interaction.reply(createEmbedMessage(MessageType.Warning, 'Player is not ready.'));
    }

    const channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.reply(createEmbedMessage(MessageType.Error, 'You are not connected to a voice channel.')); // make sure we have a voice channel
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
      return interaction.editReply(createEmbedMessage(MessageType.Info, `**${search.tracks[0].title}** queued up next!`));
    } catch (err) {
      logger.error(`${interaction.guild.id} -> ${err}`);
      return interaction.editReply(createEmbedMessage(MessageType.Error, `Something went wrong: ${err.message}`));
    }
  },
};
