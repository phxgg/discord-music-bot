const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');
const MessageType = require('../../types/MessageType');
const createEmbedMessage = require('../../utils/createEmbedMessage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle the queue.'),
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

      queue.tracks.shuffle();
      return interaction.reply(createEmbedMessage(MessageType.Info, 'Shuffled queue.'));
    } catch (err) {
      return interaction.reply(createEmbedMessage(MessageType.Error, `Something went wrong: ${err}`));
    }
  },
};
