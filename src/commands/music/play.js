const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a track.')
    .addStringOption(option => option.setName('query').setDescription('The song to play').setRequired(true)),
  /**
   * 
   * @param {import('discord.js').Interaction} interaction 
   */
  async execute(interaction) {
    const player = useMasterPlayer();
    if (!player) {
      return interaction.reply('Player is not ready!'); // make sure player is ready
    }

    const channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
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
      });

      return interaction.followUp(`**${track.title}** enqueued!`);
    } catch (err) {
      // let's return error if something failed
      return interaction.followUp(`Something went wrong: ${err}`);
    }
  },
};
