const { Events } = require('discord.js');
const mongoose = require('mongoose');
const Message = require('../models/message.js');

module.exports = {
	name: Events.MessageDelete,
	execute(message) {
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