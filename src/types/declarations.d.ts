import { CommandInteraction } from "discord.js";
import TrackBox from "../utils/trackBox";

declare module 'discord-player' {
  interface GuildQueue {
    trackbox?: TrackBox;
    metadata?: CommandInteraction;
  }
}

declare module 'discord.js' {
  interface Client {
    commands?: Collection<string, any>;
  }
}
