const { Events, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const Message = require('../models/message.js');
const Guild = require('../models/guild.js');

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {


		if (message.partial) {
			return;
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
			.setAuthor({
				name: "Chat Observer",
				url: "https://discord.com/api/oauth2/authorize?client_id=1199783232749707344&permissions=0&scope=bot",
			})
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
				{
					name:"Message attachments",
					value: message.attachments.size.toString(),
					inline: true
				},

			)
			.setColor("#f50000")
			.setFooter({
                text: "Chat Observer",
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


			for (const attachment of message.attachments.values()) {
				embed.addFields({
					name: "Attachment",
					value: `${attachment.url}`,
					inline: true
				});
			}



		
		channel.send({ embeds: [embed] });


	},
};  