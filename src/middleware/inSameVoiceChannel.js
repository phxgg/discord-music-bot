const appConfig = require('../config/appConfig');
const MessageType = require('../types/MessageType');
const createEmbedMessage = require('../utils/createEmbedMessage');

/**
 * Middleware to check if the user is connected in the same voice channel as the bot.
 * You should not use `inSameVoiceChannel` along with `inVoiceChannel`,
 * as the `inSameVoiceChannel` middleware already checks if the user is connected in a voice channel.
 * @param {import('discord.js').Interaction} interaction The interaction object.
 * @returns {Promise<boolean>} Whether the user is in the same voice channel as the bot.
 */
const inSameVoiceChannel = async (interaction) => {
  try {
    const botChannel = interaction.guild.members.me.voice.channel;
    if (!botChannel) {
      await interaction.reply(createEmbedMessage(MessageType.Error, `${appConfig.name} is not connected to a voice channel.`));
      return false;
    }

    const channel = interaction.member.voice.channel;
    if (!channel) {
      await interaction.reply(createEmbedMessage(MessageType.Error, 'You are not connected to a voice channel.'));
      return false;
    }

    if (botChannel.id !== channel.id) {
      await interaction.reply(createEmbedMessage(MessageType.Error, `${appConfig.name} is playing music in another voice channel.`));
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = inSameVoiceChannel;
