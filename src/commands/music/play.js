const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');
const logger = require('../../utils/logger');
const { parseError } = require('../../utils/funcs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a track.')
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

    // let's defer the interaction as things can take time to process
    await interaction.deferReply();
    try {
      const { track } = await player.play(channel, query, {
        nodeOptions: {
          // nodeOptions are the options for guild node (aka your queue in simple word)
          metadata: interaction, // we can access this metadata object using queue.metadata later on
        },
        requestedBy: interaction.user, // who requested the track
      });

      return interaction.followUp(createEmbedMessage(MessageType.Info, `**${track.title}** enqueued!`));
    } catch (err) {
      logger.error(`${interaction.guild.id} -> ${err}`);
      return interaction.followUp(createEmbedMessage(MessageType.Error, `Something went wrong: ${parseError(err)}`));
    }
  },
};
