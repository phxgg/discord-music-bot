const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { useMasterPlayer, useQueue } = require('discord-player');
const Paginator = require('../../utils/paginator');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Display current queue.'),
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
      const queue = useQueue(interaction.guild.id);
      if (!queue || !queue.isPlaying() || queue.tracks.size === 0) {
        return interaction.reply(createEmbedMessage(MessageType.Info, 'Queue is empty.'));
      }

      const pages = [];
      queue.tracks.map((track, index) => {
        if (index % 10 === 0) {
          pages.push(new EmbedBuilder()
            .setTitle('Queue')
            .setDescription(`Page ${pages.length + 1}`)
            .setThumbnail(queue.currentTrack.thumbnail)
            .addFields(
              queue.tracks.toArray().slice(index, index + 10).map((t, i) => ({
                name: `${index + i + 1}. ${t.author} - ${t.title} (${t.duration})`,
                value: `[Link](${t.url})`,
              })),
            )
            .setFooter({ text: `Total tracks in queue: ${queue.tracks.size}`, iconURL: queue.metadata.user.displayAvatarURL() })
            .setColor(Colors.Aqua));
        }
      });

      const paginator = new Paginator(pages);
      paginator.start({
        interaction: interaction,
      });
    } catch (err) {
      console.error(err);
      return interaction.reply(createEmbedMessage(MessageType.Error, `Something went wrong: ${err}`));
    }
  },
};
