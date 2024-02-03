const { Events, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const Message = require('../models/message.js');
const Guild = require('../models/guild.js');

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {


		if (message.partial) {
			// check if the message in db

			const msg = await Message.findOne ({ id: message.id }).catch((err) => console.log(err));
			if (!msg) {
				return;
			}

			const author = await message.guild.members.fetch(msg.authorId).catch((err) => console.log(err));
			if (!author) {
				return;
			}
			message.author = author.user;
			message.guildId = msg.guildId;
			message.channelId = msg.channelId;
			message.content = msg.content;
			message.createdAt = msg.createdAt;
			message.attachments = msg.attachments;
			

		}

		const guild = await Guild.findOne({ id: message.guildId }).catch((err) => console.log(err));

		if (!guild) {
			return;
		}

		const inList = guild.list.includes(message.channelId);

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

		const channel = message.guild.channels.cache.get(guild.logChannelId);

		if (!channel) {
			return;
		}



		const embed = new EmbedBuilder()
			.setTitle("Message deleted :wastebasket:")
			.addFields(
				{
					name: "Author username",
					value: message.author.username,
					inline: true
				},
				{
					name: "Author displayName",
					value: message.author.displayName,
					inline: true
				},
				{
					name : "Author ID",
					value: message.author.id,
					inline: true
				},
				{
					name: "Message ID",
					value: message.id,
					inline: true
				},
				{
					name: "Delete Date - Time",
					value: message.createdAt.toUTCString(),
					inline: true
				},
				{
					name : "Channel",
					value: `<#${message.channelId}>`,
					inline: true
				},
				{
					name: "Go to message context",
					value: `[Click here](https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id})`,
					inline: true
				},

			)
			.setColor("#ff0000")
			.setFooter({
                text: client.user.username,
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp();

			if(!message.content)
			{

				embed.addFields({
					name: "Message content - No content",
					value: "This message has no content, it's probably an attachment.",
					inline: false
				});

			}
			else
			{
				embed.addFields({
					name: "Message content",
					value: message.content.substring(0,1024),
					inline: false
				});
			}

			for(let i = 1024; i < message.content.length; i+=1024)
			{
				embed.addFields({
					name: "Message content continued",
					value: message.content.substring(i,i+1024),
					inline: false
				});
			}

			


			if(message.attachments.size > 0 || message.attachments.length > 0) // handle if message has attachments or not
			{
				embed.addFields({
					name: "Attachments",
					value:`${message.attachments.map(attachment => attachment.url).join("\n")}
					Attachments may not be available after deletion.`,
					inline: true
				});
			}



		
		channel.send({ embeds: [embed] });


	},
};  