const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { useQueue, useMainPlayer } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');
const logger = require('../../utils/logger');
const { parseError } = require('../../utils/funcs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Get song lyrics.')
    .addStringOption(option => option.setName('query').setDescription('Song title. If empty we\'ll check for the current playing song.').setRequired(false)),
  /**
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    const player = useMainPlayer();
    if (!player) {
      return interaction.reply(createEmbedMessage(MessageType.Warning, 'Player is not ready.'));
    }

    await interaction.deferReply();
    try {
      let songToSearch = null;
      const query = interaction.options.getString('query');
      const queue = useQueue(interaction.guild.id);
      if (!query) {
        if (!queue || !queue.isPlaying()) {
          return interaction.editReply(createEmbedMessage(MessageType.Warning, 'You did not provide a song title, and the player is not playing anything.', true));
        } else {
          songToSearch = `${queue.currentTrack.cleanTitle} ${queue.currentTrack.author}`;
        }
      } else {
        songToSearch = query;
      }

      const lyricsResults = await player.lyrics.search({ q: songToSearch }).catch(() => null);
      const lyrics = lyricsResults?.[0];
      if (!lyrics || !lyrics.plainLyrics) return interaction.editReply(createEmbedMessage(MessageType.Warning, `No lyrics found for \`${songToSearch}\`.`));

      const trimmedLyrics = lyrics.plainLyrics.substring(0, 1997);

      const embed = new EmbedBuilder()
        .setTitle(lyrics.title)
        .setURL(lyrics.url)
        .setThumbnail(lyrics.thumbnail)
        .setAuthor({
          name: lyrics.artist.name,
          iconURL: lyrics.artist.image,
          url: lyrics.artist.url,
        })
        .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
        .setFooter({
          text: 'Powered by Genius',
        })
        .setColor(Colors.Yellow);

      return interaction.editReply({ embeds: [embed] });
    } catch (err) {
      logger.error(`${interaction.guild.id} -> ${err}`);
      return interaction.editReply(createEmbedMessage(MessageType.Error, `Something went wrong: ${parseError(err)}`));
    }
  },
};
