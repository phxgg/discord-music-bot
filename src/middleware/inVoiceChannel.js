const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');

/**
 * Middleware to check if the user is currently connected in a voice channel.
 * @param {import('discord.js').Interaction} interaction The interaction object.
 * @returns {Promise<boolean>} Whether the user is in a voice channel.
 */
const inVoiceChannel = async (interaction) => {
  try {
    const channel = interaction.member.voice.channel;
    if (!channel) {
      await interaction.reply(createEmbedMessage(MessageType.Error, 'You are not connected to a voice channel.'));
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = inVoiceChannel;
