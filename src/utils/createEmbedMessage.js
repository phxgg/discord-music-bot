const { EmbedBuilder } = require('discord.js');

/**
 * Creates an embed message with the given message type and message body.
 * @param {*} messageType MessageType enum
 * @param {string} message The message body to send
 * @param {boolean=} ephemeral Whether the message should be ephemeral
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
