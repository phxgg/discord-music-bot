import TrackBox from "../utils/trackBox";

declare module 'discord-player' {
  interface GuildQueue {
    trackbox?: TrackBox;
  }
}
