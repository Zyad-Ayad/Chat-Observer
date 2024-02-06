const { Events, EmbedBuilder } = require('discord.js');
const Message = require('../models/message.js');
const Guild = require('../models/guild.js');
const { getGuild } = require('../mongooseFunctions.js');

module.exports = {
	name: Events.MessageUpdate,
	async execute(oldMessage, newMessage) {

		// if old message is not in db return

		oldMessage = await Message.findOne({ id: newMessage.id }).catch((err) => console.log(err));

		if (!oldMessage) {
			return;
		}

		

		// if new message is partial try to fetch it

		if(newMessage.partial)
		{
			try {
				await newMessage.fetch();
			} catch (error) {
				return;
			}
		}

		const guild = await getGuild(newMessage.guildId);		

		// if list is false and channel in list return
		const inList = guild.list.includes(newMessage.channelId);

		if (inList && guild.listType == false) {
			return;
		}
		
		// if list is true and channel not in list return
		if (!inList && guild.listType == true) {
			return;
		}


		// add new message content to old message history


		

		// if logChannelId is not set return
		if(!guild.logChannelId)
		{
			return;
		}	

		// get channel 
		const channel = newMessage.guild.channels.cache.get(guild.logChannelId);

		// if channel is not found return
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
					name: "Message ID",
					value: newMessage.id,
					inline: true
				},
				{
					name: "Update Date - Time",
					value: new Date().toUTCString(),
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

		// add old message attachments to array of urls
		let oldAttachments = oldMessage.attachments.map(attachment => {
			return attachment.url;
		});
		// add new message attachments to array of urls
		let newAttachments = newMessage.attachments.map(attachment => {
			return attachment.url;
		});



		oldAttachments = oldAttachments.map(attachment => {
			if(!newAttachments.includes(attachment))
			{
				return `~~[Attachment](${attachment})~~ - Deleted`;
			}
			return `[Attachment](${attachment})`;
		})

		newAttachments = newAttachments.map(attachment => {
			return `[Attachment](${attachment})`;
		})

		// add attachments string joined by new line to array, of string is greater than 1024 characters split it into two fields
		let arrayFields = [];

		for(let i=0; i<oldAttachments.length; i++)
		{
			// if array of fields is empty or can be 1024 after adding new attachment add new empty string
			if(arrayFields.length == 0 || (arrayFields[arrayFields.length-1].length + oldAttachments[i].length+10) > 1024)
			{
				arrayFields.push("");
			}

			arrayFields[arrayFields.length-1] += oldAttachments[i] + "\n";
		}

		


		// add old message attachments to it's embed using oldAttachments array || if attachment not in new attachments say it's deleted
		for (let i = 0; i < arrayFields.length; i++) {
			oldMessageEmbed.addFields(
				{
					name: "Attachments",
					value: arrayFields[i]
				}
			);
		}

		let newarrayFields = [];

		for(let i=0; i<newAttachments.length; i++)
		{
			// if array of fields is empty or can be 1024 after adding new attachment add new empty string
			if(newarrayFields.length == 0 || (newarrayFields[newarrayFields.length-1].length + newAttachments[i].length+10) > 1024)
			{
				newarrayFields.push("");
			}

			newarrayFields[newarrayFields.length-1] += newAttachments[i] + "\n";
		}

		// add new message attachments to it's embed using newAttachments array
		for (let i = 0; i < newarrayFields.length; i++) {
			newMessageEmbed.addFields(
				{
					name: "Attachments",
					value: newarrayFields[i]
				}
			);
		}
		


		// add old message to message updates array
		oldMessage.updates.push({
			content: oldMessage.content,
			attachments: oldMessage.attachments,
			createdAt: oldMessage.createdAt
		});

		// if updates array is longer than 9 remove the first element
		if(oldMessage.updates.length > 8)
		{
			oldMessage.updates.shift();
		}


		oldMessage.content = newMessage.content;
		oldMessage.attachments = newMessage.attachments.map(attachment => {
			return { url: attachment.url };
		});
		oldMessage.createdAt = new Date();

		const expireAt = new Date();

		if(!guild.level)
			expireAt.setDate(expireAt.getDate() + 1);
		else
			expireAt.setDate(expireAt.getDate() + guild.level*5);
		oldMessage.expireAt = expireAt;
		oldMessage.save().catch((err) => console.log(err));

		



		channel.send({ embeds: [messageDetails, oldMessageEmbed, newMessageEmbed] }).catch((err) => {});




	},
};  