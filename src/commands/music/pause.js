const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');
const logger = require('../../utils/logger');
const { parseError } = require('../../utils/funcs');
const inSameVoiceChannel = require('../../middleware/inSameVoiceChannel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause/resume player.'),
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
    
    try {
      queue.node.setPaused(!queue.node.isPaused());
      return interaction.reply(createEmbedMessage(MessageType.Info, `Player is now ${queue.node.isPaused() ? 'paused' : 'resumed'}.`));
    } catch (err) {
      logger.error(`${interaction.guild.id} -> ${err}`);
      return interaction.reply(createEmbedMessage(MessageType.Error, `Something went wrong: ${parseError(err)}`));
    }
  },
};
