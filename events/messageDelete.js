const { Events, EmbedBuilder } = require('discord.js');
const Message = require('../models/message.js');
const Guild = require('../models/guild.js');
const { getGuild } = require('../mongooseFunctions.js');

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {

		message = await Message.findOne({ id: message.id }).catch((err) => console.log(err));
		
		if(!message)
		{
			return;
		}

		await Message.updateOne({ id : message.id }, { $set: { deleted: true } }).catch((err) => console.log(err));

		const guild = await getGuild(message.guildId);		

		// if list is false and channel in list return
		const inList = guild.list.includes(message.channelId);

		if (inList && guild.listType == false) {
			return;
		}
		
		// if list is true and channel not in list return
		if (!inList && guild.listType == true) {
			return;
		}

		// if logChannelId is not set return
		if(!guild.logChannelId)
		{
			return;
		}	

		// get guild from cach if not found fetch it  if not found return
		let dguild = await client.guilds.cache.get(message.guildId);

		// maybe guild is deleted or not found
		if(!dguild)
		{
			return;
		}
	
		// get channel
		const channel = dguild.channels.cache.get(guild.logChannelId);

		// if channel is not found return
		if (!channel) {
			return;
		}

		// get author of the message
		const author = await dguild.members.fetch(message.authorId);

		// if author is not found return
		if(!author)
		{
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle("Message deleted :wastebasket:")
			.addFields(
				{
					name: "Author username",
					value: author.user.username,
					inline: true
				},
				{
					name: "Author displayName",
					value: author.user.displayName,
					inline: true
				},
				{
					name : "Author ID",
					value: author.user.id,
					inline: true
				},
				{
					name: "Message ID",
					value: message.id,
					inline: true
				},
				{
					name: "Delete Date - Time",
					value: new Date().toUTCString(),
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