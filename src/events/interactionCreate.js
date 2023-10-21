const { Events } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  name: Events.InteractionCreate,
  /**
   * This event runs when a user creates an interaction.
   * @param {import('discord.js').Interaction} interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      if ('middleware' in command) {
        for (const middleware of command.middleware) {
          const result = await middleware(interaction);
          if (!result) {
            logger.warn(`Middleware ${middleware.name} returned false.`);
            return;
          }
        }
      }
      await command.execute(interaction);
    } catch (err) {
      logger.error(`Error executing ${interaction.commandName}`, err);
    }
  },
};
