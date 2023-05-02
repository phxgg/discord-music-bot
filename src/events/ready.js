const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
  /**
	 * 
	 * @param {import('discord.js').Client} client 
	 * @returns 
	 */
	execute(client) {
		console.log(`Logged in as ${client.user.tag}`);
	},
};
