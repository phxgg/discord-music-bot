const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue, useTimeline } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');
const logger = require('../../utils/logger');
const { parseError } = require('../../utils/funcs');
const inSameVoiceChannel = require('../../middleware/inSameVoiceChannel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjust the player volume.')
    .addNumberOption(option => option.setName('value').setDescription('Volume level').setRequired(true).setMaxValue(100).setMinValue(0)),
  middleware: [inSameVoiceChannel],
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
      return interaction.reply(createEmbedMessage(MessageType.Warning, 'There is no queue.'));
    }

    const { setVolume } = useTimeline(interaction.guild.id);

    try {
      // const value = interaction.options.getString('value', true); // we need input/query to play
      const value = interaction.options.getNumber('value', true);
      setVolume(value);
      return interaction.reply(createEmbedMessage(MessageType.Info, `Volume set to ${value}.`));
    } catch (err) {
      logger.error(`${interaction.guild.id} -> ${err}`);
      return interaction.reply(createEmbedMessage(MessageType.Error, `Something went wrong: ${parseError(err)}`));
    }
  },
};
