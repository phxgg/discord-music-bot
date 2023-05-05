# discord-music-bot

> __Warning__
> This project is still in development and is not ready for use yet.

A Discord bot that plays music.

## Installation

**Node.js v16.9.0** or newer is required.

1. Copy `.env.example` to `.env` and configure. It is recommended to not change the `DP_FORCE_YTDL_MOD` variable.
2. Install dependencies: `npm install`
3. Deploy commands:
  - For a specific guild: `npm run deploy` (must have set the `GUILD_ID` variable in `.env`)
  - For all guilds: `npm run deploy-global` (will take a while for discord to deploy)
4. Start the bot: `npm start`

## Undeploy commands:

1. For a specific guild: `npm run undeploy` (must have set the `GUILD_ID` variable in `.env`)
2. For all guilds: `npm run undeploy-global`

## TODO

- [ ] Better message handling
- [ ] Lyrics command
- More that I can't think of now...
