require('dotenv').config();
const path = require('node:path');
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager(path.join(__dirname, 'app.js'), {
  token: process.env.DISCORD_BOT_TOKEN,
});
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();

// Monitoring web server
if (process.env.ENABLE_MONITORING === 'true') {
  const express = require('express');
  const app = express();

  app.use(require('express-status-monitor')());

  app.get('/', (req, res) => {
    res.redirect('/status');
  });

  app.listen(3000, () => {
    console.log('[Discord Music Bot] Monitoring web server: http://localhost:3000');
  });
}
