import { GuildQueue } from "discord-player";
import logger from "../utils/logger";

export default {
  name: 'playerError',
  async execute(queue: GuildQueue, err: any) {
    // Emitted when the audio player errors while streaming audio track
    logger.error(`Player error event -> ${queue.guild.id}`, err);
  },
};
