import { GuildQueue, Track } from "discord-player";
import logger from "../utils/logger";
import TrackBox from "../utils/trackBox";
import { CommandInteraction } from "discord.js";
import { MessageType } from "../types/MessageType";
import { createEmbedMessage } from "../utils/funcs";

export default {
  name: 'playerStart',
  async execute(queue: GuildQueue, track: Track) {
    logger.info(`${queue.guild.id} -> playerStart event`);
    // Emitted when the player starts to play a song
    const metadata = queue.metadata as CommandInteraction;
    if (process.env.ENABLE_TRACKBOX === 'true') {
      if (!queue.trackbox) {
        queue.trackbox = new TrackBox({
          channel: metadata.channel!,
          queue: queue,
        });
      }
      queue.trackbox.start();
    } else {
      await metadata.channel?.send(createEmbedMessage(MessageType.Info, `Now playing **[${track.title}](${track.url})**!`));
    }
  },
};
