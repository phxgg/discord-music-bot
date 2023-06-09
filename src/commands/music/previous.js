const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer, useQueue } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('previous')
    .setDescription('Play previous track.'),
  /**
   * @param {import('discord.js').CommandInteraction} interaction 
   */
  async execute(interaction) {
    const player = useMasterPlayer();
    if (!player) {
      return interaction.reply(createEmbedMessage(MessageType.Warning, 'Player is not ready.'));
    }

    const queue = useQueue(interaction.guild.id);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply(createEmbedMessage(MessageType.Error, 'Nothing is playing!'));
    }

    await interaction.deferReply();
    try {
      const previousTrack = queue.history.previousTrack;
      queue.history.previous()
        .then(async () => {
          interaction.editReply(createEmbedMessage(MessageType.Success, `**${previousTrack.title}** enqueued!`));
        })
        .catch(async (err) => {
          interaction.editReply(createEmbedMessage(MessageType.Warning, err.message || 'An error occurred!'));
        });
    } catch (err) {
      return interaction.editReply(createEmbedMessage(MessageType.Error, `Something went wrong: ${err}`));
    }
  },
};
