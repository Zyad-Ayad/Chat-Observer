const { Events, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const Message = require('../models/message.js');
const Guild = require('../models/guild.js');

module.exports = {
	name: Events.MessageUpdate,
	async execute(oldMessage, newMessage) {

		if (oldMessage.partial) {
			try {
				await oldMessage.fetch();
			}
			catch (err) {
				return;
			}
		}

		if (newMessage.partial) {
			try {
				await newMessage.fetch();
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

		if (inList && guild.listType == false) {
			return;
		}
		
		if (!inList && guild.listType == true) {
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
			.setTitle("Message edited - Details :pencil:")
			.addFields(
				{
					name: "Author username",
					value: newMessage.author.username,
					inline: true
				},
				{
					name: "Author displayName",
					value: newMessage.author.displayName,
					inline: true
				},
				{
					name : "Author ID",
					value: newMessage.author.id,
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
				},

			)
			.setColor("#ffa200")
			.setFooter({
                text: client.user.username,
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp();

		const oldMessageEmbed = new EmbedBuilder()
			.setTitle("Old message")
			.setColor("#ff0000")
			.setFooter({
                text: client.user.username,
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp();

		if(oldMessage.content)
		{
			oldMessageEmbed.setDescription(oldMessage.content);
		}
		else
		{
			oldMessageEmbed.setDescription("No This message has no content, it's probably an attachment.");
		}



		const newMessageEmbed = new EmbedBuilder()
			.setTitle("New message")
			.setColor("#00ff00")
			.setFooter({
                text: client.user.username,
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp();

		if(newMessage.content)
		{
			newMessageEmbed.setDescription(newMessage.content);
		}
		else
		{
			newMessageEmbed.setDescription("No This message has no content, it's probably an attachment.");
		}


		// Get attachments that are added to new message that wasn't in old message
		const newAttachments = newMessage.attachments.filter(attachment => !oldMessage.attachments.has(attachment.id));
		
		// Get attachments that are removed from new message that was in old message
		const removedAttachments = oldMessage.attachments.filter(attachment => !newMessage.attachments.has(attachment.id));

		if(newAttachments.size > 0)
		{
			newMessageEmbed.addFields({
				name: "Added Attachments",
				value: newAttachments.map(attachment => attachment.url).join("\n"),
				inline: true
			});
		}

		if(removedAttachments.size > 0)
		{
			oldMessageEmbed.addFields({
				name: "Removed Attachments",
				value: removedAttachments.map(attachment => attachment.url).join("\n"),
				inline: true
			});
		}
		


			
		channel.send({ embeds: [messageDetails, oldMessageEmbed, newMessageEmbed] });





	},
};  