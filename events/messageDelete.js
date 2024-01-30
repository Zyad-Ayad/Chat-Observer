const { Events } = require('discord.js');
const mongoose = require('mongoose');
const Message = require('../models/message.js');

module.exports = {
	name: Events.MessageDelete,
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

		
		Message.updateOne({
			id: message.id,
		}, {
			$set: {
                deleted: true,
			},
		}).catch((err) => {
			console.log(err);
		});
	},
};  