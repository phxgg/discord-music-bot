import { GuildQueue } from "discord-player";
import logger from "../utils/logger";
import { CommandInteraction } from "discord.js";
import { cleanupQueue, createEmbedMessage } from "../utils/funcs";
import { MessageType } from "../types/MessageType";

export default {
  name: 'emptyQueue',
  async execute(queue: GuildQueue) {
    logger.info(`${queue.guild.id} -> emptyQueue event`);
    // Emitted when the player queue has finished
    const metadata = queue.metadata as CommandInteraction;
    await cleanupQueue(queue);
    await metadata.channel?.send(createEmbedMessage(MessageType.Info, 'Queue finished!'));
  },
};
