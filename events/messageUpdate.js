const { Events } = require('discord.js');
const mongoose = require('mongoose');
const Message = require('../models/message.js');

module.exports = {
	name: Events.MessageUpdate,
	async execute(oldMessage, newMessage) {
						
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