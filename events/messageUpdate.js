const { Events } = require('discord.js');
const mongoose = require('mongoose');
const Message = require('../models/message.js');

module.exports = {
	name: Events.MessageUpdate,
	execute(oldMessage, newMessage) {
		if (message.author.bot) return;
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