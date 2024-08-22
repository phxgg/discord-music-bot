# discord-music-bot

> __Warning__
> This project is still in development.

A Discord bot that plays music.

## Installation

**Node.js v20.12.1** or newer is required.

1. Copy `.env.example` to `.env` and configure the values. See [Environment variables](#environment-variables) for more information.
2. Install dependencies: `npm install`
3. Install FFmpeg on your system: [FFmpeg](https://ffmpeg.org/download.html)
4. Deploy commands. See [Deploy commands](#deploy-commands) for more information.
5. Start the bot: `npm start`

## Environment variables

| Variable | Description | Default value | Required |
| -------- | ----------- | ------------- | -------- |
| `DISCORD_BOT_TOKEN` | Discord bot token | `null` | `true` |
| `APPLICATION_ID` | Discord application ID | `null` | `true` |
| `GUILD_ID` | Guild ID to deploy commands to | `null` | `false` if you deploy globally |
| `YT_EXTRACTOR_AUTH` | YouTube AUTH tokens for the extractor. [View Docs](https://github.com/retrouser955/discord-player-youtubei) | `null` | `false` |
| `ENABLE_TRACKBOX` | Whether you wish to enable the track box player. | `true` | `false` |
| `ENABLE_IP_ROTATION` | Whether you wish to enable IP rotation for YouTube. | `false` | `false` |
| `IPV6_BLOCKS` | A space-separated list of IPv6 blocks to use for IP rotation. | `null` | `false` if `ENABLE_IP_ROTATION` is `false` |
| `NODE_ENV` | Node environment. Use `development` or `production` | `development` | `true` |

## Deploy commands

1. For a specific guild: `npm run deploy` (must have set the `GUILD_ID` variable in `.env`)
2. For all guilds: `npm run deploy-global` (will take a while for discord to deploy)

**Undeploy**
1. For a specific guild: `npm run undeploy` (must have set the `GUILD_ID` variable in `.env`)
2. For all guilds: `npm run undeploy-global`
