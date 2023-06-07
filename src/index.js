require('dotenv').config();
const path = require('node:path');
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager(path.join(__dirname, 'app.js'), {
  token: process.env.DISCORD_BOT_TOKEN,
});
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();
