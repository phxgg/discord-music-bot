const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjust the player volume.')
    .addNumberOption(option => option.setName('value').setDescription('Volume level').setRequired(true).setMaxValue(100).setMinValue(0)),
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
      if (!queue || !queue.isPlaying()) {
        return interaction.reply(createEmbedMessage(MessageType.Warning, 'There is no queue.'));
      }

      // const value = interaction.options.getString('value', true); // we need input/query to play
      const value = interaction.options.getNumber('value', true);

      queue.node.setVolume(value);
      return interaction.reply(createEmbedMessage(MessageType.Info, `Volume set to ${value}.`));
    } catch (err) {
      return interaction.reply(createEmbedMessage(MessageType.Error, `Something went wrong: ${err}`));
    }
  },
};
