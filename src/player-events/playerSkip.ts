import { GuildQueue, Track } from "discord-player";
import logger from "../utils/logger";
import { CommandInteraction } from "discord.js";
import { createEmbedMessage } from "../utils/funcs";
import { MessageType } from "../types/MessageType";

export default {
  name: 'playerSkip',
  async execute(queue: GuildQueue, track: Track) {
    logger.info(`${queue.guild.id} -> playerSkip event`);
    // Emitted when the audio player fails to load the stream for a song
    // EDIT: This event is emitted when queue.node.skip() is called,
    // which means that this event is emitted when the player skips a track.
    // For this reason, we should not be sending a warning message here.
    const metadata = queue.metadata as CommandInteraction;
    // await metadata.channel?.send(createEmbedMessage(MessageType.Warning, `Skipping **[${track.title}](${track.url})** due to an issue!`));
  },
};