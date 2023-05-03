const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('song')
    .setDescription('View current playing song.'),
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
        return interaction.reply('Nothing is playing!');
      }

      const currentTrack = queue.currentTrack;
      return interaction.reply(`Current track is **[${currentTrack.title}](${currentTrack.url})** by **${currentTrack.author}**!`);
    } catch (err) {
      return interaction.reply(`Something went wrong: ${err}`);
    }
  },
};
