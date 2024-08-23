import { GuildQueue } from "discord-player";
import { cleanupQueue, createEmbedMessage } from "../utils/funcs";
import { CommandInteraction } from "discord.js";
import { MessageType } from "../types/MessageType";
import logger from "../utils/logger";

export default {
  name: 'queueDelete',
  async execute(queue: GuildQueue) {
    logger.info(`${queue.guild.id} -> queueDelete event`);
    // Emitted when the player queue has been deleted
    const metadata = queue.metadata as CommandInteraction;
    await cleanupQueue(queue);
    await metadata.channel?.send(createEmbedMessage(MessageType.Info, 'Queue deleted!'));
  },
};