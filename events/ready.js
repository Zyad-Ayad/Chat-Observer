const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		const botStatusList = [
			"/help | Watching your messages",
			"/help | Did you delete something?",
			"/help | Try /history <messageID>",
			"/help | Try /history <messageID>",
			"/help | Watch your messages",
		];

		setInterval(() => {
			const index = Math.floor(Math.random() * (botStatusList.length - 1) + 1);
			client.user.setActivity(botStatusList[index]);
		}, 60*1000);


	},
};  