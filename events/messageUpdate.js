const { Events, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const Message = require('../models/message.js');
const Guild = require('../models/guild.js');

module.exports = {
	name: Events.MessageUpdate,
	async execute(oldMessage, newMessage) {

		if (oldMessage.partial) {
			try {
				await message.fetch();
			}
			catch (err) {
				return;
			}
		}

		if (newMessage.partial) {
			try {
				await message.fetch();
			}
			catch (err) {
				return;
			}
		}


		const guild = await Guild.findOne({ id: newMessage.guildId }).catch((err) => console.log(err));

		if (!guild) {
			return;
		}

		const inList = guild.list.includes(newMessage.channelId);

		if (inList && guild.listType == "blackList") {
			return;
		}
		
		if (!inList && guild.listType == "whiteList") {
			return;
		}

		if(!guild.logChannelId)
		{
			return;
		}	

		const channel = newMessage.guild.channels.cache.get(guild.logChannelId);

		if (!channel) {
			return;
		}

		const messageDetails = new EmbedBuilder()
			.setTitle("Message edited - Details")
			.addFields(
				{
					name: "author username",
					value: newMessage.author.username,
					inline: true
				},
				{
					name: "author displayName",
					value: newMessage.author.displayName,
					inline: true
				},
				{
					name: "Update Date - Time",
					value: newMessage.editedAt.toUTCString(),
					inline: true
				},
				{
					name : "Channel",
					value: `<#${newMessage.channelId}>`,
					inline: true
				},
				{
					name: "Go to message context",
					value: `[Click here](https://discord.com/channels/${newMessage.guildId}/${newMessage.channelId}/${newMessage.id})`,
					inline: true
				}
			)
			.setColor("#ffa200")

		const oldMessageEmbed = new EmbedBuilder()
			.setTitle("Old message")
			.setDescription(oldMessage.content)
			.setColor("#ff0000")

		const newMessageEmbed = new EmbedBuilder()
			.setTitle("New message")
			.setDescription(newMessage.content)
			.setColor("#00ff00")
			
		channel.send({ embeds: [messageDetails, oldMessageEmbed, newMessageEmbed] });





	},
};  