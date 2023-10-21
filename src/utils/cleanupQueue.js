const logger = require('./logger');

/**
 * Destroys the queue trackbox if it exists, then deletes it from the queue object.
 * @param {import('discord-player').GuildQueue} queue
 */
const cleanupQueue = async (queue) => {
  logger.info(`${queue.guild.id} -> cleanupQueue called`);
  if (queue.trackbox) {
    await queue.trackbox.destroy();
  }
  delete queue.trackbox;
};

module.exports = cleanupQueue;
