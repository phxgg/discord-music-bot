import { GuildQueue } from "discord-player";
import logger from "../utils/logger";
import { CommandInteraction } from "discord.js";
import TrackBox from "../utils/trackBox";

export default {
  name: 'playerPause',
  async execute(queue: GuildQueue) {
    logger.info(`${queue.guild.id} -> playerPause event`);
    // Emitted when the audio player fails to load the stream for a song
    const metadata = queue.metadata as CommandInteraction;
    const trackbox = queue.trackbox as TrackBox;
    if (trackbox) {
      trackbox.playerPause();
    }
  },
};
