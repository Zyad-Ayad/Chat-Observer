const { Events } = require('discord.js');
const mongoose = require('mongoose');
const Message = require('../models/message.js');
const Guild = require('../models/guild.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.bot) return;

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


		
		msg = new Message({
			channelId: message.channelId,
			guildId: message.guildId,
			id: message.id,
			createdTimestamp: message.createdTimestamp,
			content: message.content,
			authorId: message.author.id,
			deleted: false,
		});
		msg.save().catch((err) => console.log(err));
	},
};  