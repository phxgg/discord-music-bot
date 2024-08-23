import { EmbedBuilder } from "discord.js";
import { MessageType } from "../types/MessageType";
import { GuildQueue } from "discord-player";
import logger from "./logger";

/**
 * Creates an embed message with the given message type and message body.
 */
export function createEmbedMessage(messageType: MessageType, message: string, ephemeral: boolean = false): any {
  return {
    embeds: [
      new EmbedBuilder()
        .setDescription(message)
        .setColor(messageType),
    ],
    ephemeral: ephemeral,
  };
};

/**
 * Destroys the queue trackbox if it exists, then deletes it from the queue object.
 */
export async function cleanupQueue(queue: GuildQueue): Promise<void> {
  logger.info(`${queue.guild.id} -> cleanupQueue called`);
  if (queue.trackbox) {
    await queue.trackbox.destroy();
  }
  delete queue.trackbox;
};

export function parseError (err: any): string {
  if (!err) return 'Unknown error';
  if (!(err instanceof Error) && typeof err === 'string') return err;

  if (process.env.NODE_ENV === 'development') {
    return err.stack;
  } else {
    return err.name || 'Unknown error';
  }
};