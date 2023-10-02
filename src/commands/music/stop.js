const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');
const logger = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop player and clear queue.'),
  /**
   * @param {import('discord.js').CommandInteraction} interaction 
   */
  async execute(interaction) {
    const player = useMainPlayer();
    if (!player) {
      return interaction.reply(createEmbedMessage(MessageType.Warning, 'Player is not ready.'));
    }

    const queue = useQueue(interaction.guild.id);
    if (!queue) {
      return interaction.reply(createEmbedMessage(MessageType.Warning, 'There is no queue.'));
    }

    try {
      queue.delete();
      return interaction.reply(createEmbedMessage(MessageType.Info, 'Stopped player'));
    } catch (err) {
      logger.error(`${interaction.guild.id} -> ${err}`);
      return interaction.reply(createEmbedMessage(MessageType.Error, `Something went wrong: ${err.message}`));
    }
  },
};
