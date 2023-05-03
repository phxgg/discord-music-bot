const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');
const Paginator = require('../../utils/paginator');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Display current queue.'),
  /**
   * 
   * @param {import('discord.js').Interaction} interaction 
   */
  async execute(interaction) {
    const player = useMasterPlayer();
    if (!player) {
      return interaction.reply('Player is not ready!'); // make sure player is ready
    }

    try {
      const queue = player.nodes.get(interaction.guild);
      if (!queue || !queue.isPlaying()) {
        return interaction.reply('Queue is empty.');
      }

      // TODO: Fix paginator
      const paginator = new Paginator(queue.tracks.map((track, index) => { return `${index + 1}. ${track.title}`; }));
      paginator.start({
        interaction: interaction,
      });
    } catch (err) {
      console.error(err);
      return interaction.reply(`Something went wrong: ${err}`);
    }
  },
};
