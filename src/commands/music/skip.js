const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');
const logger = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip current track.'),
  /**
   * @param {import('discord.js').CommandInteraction} interaction 
   */
  async execute(interaction) {
    const player = useMainPlayer();
    if (!player) {
      return interaction.reply(createEmbedMessage(MessageType.Warning, 'Player is not ready.'));
    }

    const queue = useQueue(interaction.guild.id);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply(createEmbedMessage(MessageType.Error, 'Nothing is playing!'));
    }

    await interaction.deferReply();
    try {
      const currentTrack = queue.currentTrack;
      queue.node.skip();
      return interaction.editReply(createEmbedMessage(MessageType.Info, `Skipped **[${currentTrack.title}](${currentTrack.url})**!`));
    } catch (err) {
      logger.error(`${interaction.guild.id} -> ${err}`);
      return interaction.editReply(createEmbedMessage(MessageType.Error, `Something went wrong: ${err.message}`));
    }
  },
};
