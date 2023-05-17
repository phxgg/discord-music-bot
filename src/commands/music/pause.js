const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer, useQueue } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause/resume player.'),
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
      if (!queue || !queue.isPlaying()) {
        return interaction.reply(createEmbedMessage(MessageType.Warning, 'There is no queue.'));
      }

      queue.node.setPaused(!queue.node.isPaused());
      return interaction.reply(createEmbedMessage(MessageType.Info, `Player is now ${queue.node.isPaused() ? 'paused' : 'resumed'}.`));
    } catch (err) {
      return interaction.reply(createEmbedMessage(MessageType.Error, `Something went wrong: ${err}`));
    }
  },
};
