import 'dotenv/config';

import { ShardingManager } from 'discord.js';
import path from 'path';

const manager = new ShardingManager(path.join(__dirname, 'app.ts'), {
  token: process.env.DISCORD_BOT_TOKEN,
});
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();
