const { Events } = require('discord.js');
const mongoose = require('mongoose');
const Message = require('../models/message.js');

module.exports = {
	name: Events.MessageUpdate,
	async execute(oldMessage, newMessage) {
		if (message.author.bot) return;

		// if message is sent by webhook, return
		if(message.webhookId) return;
		
		let guild = await Guild.findOne({ id: message.guildId }).catch((err) => console.log(err));

        if(!guild)
        {
            guild = new Guild({
                id: message.guildId,
            });
            guild.save().catch((err) => console.log(err));
        }

		const inList = guild.list.includes(message.channelId);

		if(inList && guild.listType == "blackList")
		{
			return;
		}

		if(!inList && guild.listType == "whiteList")
		{
			return;
		}

		
		Message.updateOne({
			id: oldMessage.id,
		}, {
			$push: {
				updates: {
					content: newMessage.content,
					editedTimestamp: newMessage.editedTimestamp,
				},
			},
		}).catch((err) => {
			console.log(err);
		});
	},
};  