const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { useMasterPlayer } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');
const { lyricsExtractor } = require('@discord-player/extractor');
const lyricsFinder = lyricsExtractor(process.env.GENIUS_ACCESS_TOKEN);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Get song lyrics.')
    .addStringOption(option => option.setName('query').setDescription('Song title. If empty we\'ll check for the current playing song.').setRequired(false)),
  /**
   * 
   * @param {import('discord.js').CommandInteraction} interaction 
   */
  async execute(interaction) {
    const player = useMasterPlayer();
    if (!player) {
      return interaction.reply(createEmbedMessage(MessageType.Warning, 'Player is not ready.'));
    }

    try {
      let songToSearch = null;
      const query = interaction.options.getString('query');
      if (!query) {
        const queue = player.nodes.get(interaction.guild);
        if (!queue || !queue.isPlaying()) {
          return interaction.reply(createEmbedMessage(MessageType.Warning, 'You did not provide a song title, and the player is not playing anything.', true));
        } else {
          songToSearch = `${queue.currentTrack.title} ${queue.currentTrack.author}`;
        }
      } else {
        songToSearch = query;
      }

      await interaction.deferReply();

      const lyrics = await lyricsFinder.search(songToSearch).catch(() => null);
      if (!lyrics) return interaction.followUp(createEmbedMessage(MessageType.Warning, `No lyrics found for \`${songToSearch}\`.`));

      const trimmedLyrics = lyrics.lyrics.substring(0, 1997);

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

      return interaction.followUp({ embeds: [embed] });
    } catch (err) {
      return interaction.reply(createEmbedMessage(MessageType.Error, `Something went wrong: ${err}`));
    }
  },
};
