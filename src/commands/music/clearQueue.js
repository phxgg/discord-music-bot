const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer, useQueue } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearqueue')
    .setDescription('Clear queue.'),
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
      return interaction.reply(createEmbedMessage(MessageType.Warning, 'There is no queue.'));
    }

    try {
      queue.clear();
      return interaction.reply(createEmbedMessage(MessageType.Info, 'Cleared queue.'));
    } catch (err) {
      return interaction.reply(createEmbedMessage(MessageType.Error, `Something went wrong: ${err}`));
    }
  },
};
