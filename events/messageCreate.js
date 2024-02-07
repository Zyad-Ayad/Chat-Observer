const { Events } = require('discord.js');
const Message = require('../models/message.js');
const Guild = require('../models/guild.js');
const { getGuild } = require('../mongooseFunctions.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		// if message is sent by bot return
		if (message.author.bot) return;

		// if message is sent by webhook return
		if(message.webhookId) return;

		// if dm return
		if (!message.guildId) {
			return;
		}

		const guild = await getGuild(message.guildId);


		// if list is false and channel in list return
		if (guild.list.includes(message.channelId) && guild.listType == 0) return;

		// if list is true and channel not in list return
		if (!guild.list.includes(message.channelId) && guild.listType == 1) return;


		const DBmessage = new Message({
			id: message.id,
			guildId: message.guildId,
			createdAt: message.createdAt,
			channelId: message.channelId,
			content: message.content,
			authorId: message.author.id,
			attachments: message.attachments.map(attachment => {
				return { url: attachment.url };
			}),
		});

		const expireAt = message.createdAt;
		if(!guild.level)
			expireAt.setDate(expireAt.getDate() + 1);
		else
			expireAt.setDate(expireAt.getDate() + guild.level*5);
		DBmessage.expireAt = expireAt;
		DBmessage.save().catch((err) => console.log(err));
		
	},
};  