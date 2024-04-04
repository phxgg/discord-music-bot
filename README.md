# discord-music-bot

> __Warning__
> This project is still in development.

A Discord bot that plays music.

## Installation

**Node.js v16.9.0** or newer is required.

1. Copy `.env.example` to `.env` and configure the values. See [Environment variables](#environment-variables) for more information.
2. Install dependencies: `npm install`
3. Deploy commands. See [Deploy commands](#deploy-commands) for more information.
4. Start the bot: `npm start`

## Environment variables

| Variable | Description | Default value | Required |
| -------- | ----------- | ------------- | -------- |
| `DISCORD_BOT_TOKEN` | Discord bot token | `null` | `true` |
| `APPLICATION_ID` | Discord application ID | `null` | `true` |
| `GENIUS_ACCESS_TOKEN` | Genius API access token if you want `/lyrics` to use your own API | `null` | `false` |
| `GUILD_ID` | Guild ID to deploy commands to | `null` | `false` if you deploy globally |
| `DP_FORCE_YTDL_MOD` | Force the use of a specific streaming library | `@distube/ytdl-core` | `false` |
| `ENABLE_TRACKBOX` | Whether you wish to enable the track box player. | `true` | `false` |
| `ENABLE_IP_ROTATION` | Whether you wish to enable IP rotation for YouTube. | `false` | `false` |
| `IPV6_BLOCKS` | A space-separated list of IPv6 blocks to use for IP rotation. | `null` | `false` if `ENABLE_IP_ROTATION` is `false` |

## Deploy commands

1. For a specific guild: `npm run deploy` (must have set the `GUILD_ID` variable in `.env`)
2. For all guilds: `npm run deploy-global` (will take a while for discord to deploy)

**Undeploy**
1. For a specific guild: `npm run undeploy` (must have set the `GUILD_ID` variable in `.env`)
2. For all guilds: `npm run undeploy-global`
