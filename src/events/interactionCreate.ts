import { Events, Interaction } from 'discord.js';
import { IBaseCommand } from '@/commands/IBaseCommand.js';

import logger from '@/lib/logger.js';

export default {
  name: Events.InteractionCreate,
  /**
   * This event runs when a user creates an interaction.
   */
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand() && !interaction.isAutocomplete())
      return;

    const command = interaction.client.commands?.get(
      interaction.commandName,
    ) as IBaseCommand;
    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    // Handle autocomplete interactions and return early
    if (interaction.isAutocomplete()) {
      try {
        if (typeof command.autocomplete === 'function') {
          await command.autocomplete(interaction);
        } else {
          logger.warn(
            `Autocomplete is not implemented for command '${interaction.commandName}'.`,
          );
        }
      } catch (err) {
        logger.error(
          `Error executing autocomplete for command '${interaction.commandName}'`,
          err,
        );
      }
      return;
    }

    // Handle command interactions and execute the command
    try {
      if (Array.isArray(command.middleware)) {
        for (const middleware of command.middleware) {
          const result = await middleware(interaction);
          if (!result) {
            logger.warn(`Middleware ${middleware.name} returned false.`);
            return;
          }
        }
      }
      // Execute the main command logic
      if (typeof command.execute === 'function') {
        await command.execute(interaction);
      } else {
        logger.warn(
          `Execute is not implemented for command '${interaction.commandName}'.`,
        );
      }
    } catch (err) {
      logger.error(`Error executing '${interaction.commandName}'`, err);
    }
  },
};
