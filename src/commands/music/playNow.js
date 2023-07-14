const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playnow')
    .setDescription('Insert a track at the top of the queue and skip current track.')
    .addStringOption(option => option.setName('query').setDescription('The song to play').setRequired(true)),
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
      queue.node.skip();
      return interaction.editReply(createEmbedMessage(MessageType.Info, `**${search.tracks[0].title}** playing now!`));
    } catch (err) {
      // let's return error if something failed
      return interaction.editReply(createEmbedMessage(MessageType.Error, `Something went wrong: ${err}`));
    }
  },
};
