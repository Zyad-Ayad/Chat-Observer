const { Events } = require('discord.js');
const mongoose = require('mongoose');
const Message = require('../models/message.js');

module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		if (message.author.bot) return;
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