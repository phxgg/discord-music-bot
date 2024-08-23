import { GuildQueue } from "discord-player";
import logger from "../utils/logger";
import { cleanupQueue, createEmbedMessage } from "../utils/funcs";
import { CommandInteraction } from "discord.js";
import { MessageType } from "../types/MessageType";

export default {
  name: 'disconnect',
  async execute(queue: GuildQueue) {
    logger.info(`${queue.guild.id} -> disconnect event`);
    // Emitted when the bot leaves the voice channel
    const metadata = queue.metadata as CommandInteraction;
    await cleanupQueue(queue);
    await metadata.channel?.send(createEmbedMessage(MessageType.Info, 'Looks like my job here is done, leaving now!'));
  },
};
