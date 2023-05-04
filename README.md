# discord-music-bot

> __Warning__
> This project is still in development and is not ready for use yet.

A Discord bot that plays music.

## Installation

**Node.js v16.9.0** or newer is required.

1. Copy `.env.example` to `.env` and configure. It is recommended to not change the `DP_FORCE_YTDL_MOD` variable.
2. Install dependencies: `npm install`
3. Register guild commands: `npm run register`
4. Start the bot: `npm start`

## TODO

- [ ] **PRIORITY**: Check if this works in multiple guilds
- [ ] If we pause a track via the track box, the collector timer still runs. Thus, if we pause a track for a long time, the collector will stop and we won't be able to use the track box buttons anymore. A possible solution is to destroy the queue if a track is paused for too long.
- [ ] The track box button interactions are different from the command interactions. This can be confusing because if, for example, somebody pauses a track using `/pause`, then the track box buttons will still show the `pause` button when it should be displaying the `play` button.
- [ ] Better message handling
- [ ] Lyrics command
- [ ] Volume command
- More that I can't think of now...
