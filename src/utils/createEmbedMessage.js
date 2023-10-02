const { EmbedBuilder } = require('discord.js');

/**
 * @param {*} messageType 
 * @param {string} message 
 * @param {boolean=} ephemeral
 */
const createEmbedMessage = (messageType, message, ephemeral = false) => {
  return {
    embeds: [
      new EmbedBuilder()
        .setDescription(message)
        .setColor(messageType),
    ],
    ephemeral: ephemeral,
  };
};

module.exports = createEmbedMessage;
