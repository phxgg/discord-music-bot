const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop player and clear queue.'),
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
      const queue = player.nodes.get(interaction.guild);
      if (!queue) {
        return interaction.reply(createEmbedMessage(MessageType.Warning, 'There is no queue.'));
      }

      queue.delete();
      return interaction.reply(createEmbedMessage(MessageType.Info, 'Stopped player'));
    } catch (err) {
      return interaction.reply(createEmbedMessage(MessageType.Error, `Something went wrong: ${err}`));
    }
  },
};
