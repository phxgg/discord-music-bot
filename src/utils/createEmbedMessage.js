const { EmbedBuilder } = require('discord.js');

/**
 * 
 * @param {*} messageType 
 * @param {string} message 
 */
const createEmbedMessage = (messageType, message) => {
  return {
    embeds: [
      new EmbedBuilder()
        .setDescription(message)
        .setColor(messageType),
    ],
  };
};

module.exports = createEmbedMessage;
