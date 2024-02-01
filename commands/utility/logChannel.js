const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const Guild = require('../../models/guild.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logchannel')
		.setDescription('set channel for logging messages updates and deletions.')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to log to')
				.addChannelTypes(ChannelType.GuildText))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageGuild),
	async execute(interaction) {

		const channel = interaction.options.getChannel('channel');
		if(!channel)
		{
			const guild = await Guild.findOne({ id: interaction.guild.id }).catch((err) => console.log(err));
			if (!guild) {
				guild = new Guild({
					id: interaction.guild.id,
				});
			}
			guild.logChannelId = null;
			guild.save().catch((err) => console.log(err));
			return await interaction.reply({ content: `Logging disabled`, ephemeral: true });
		}

		// check if bot have read/write permissions in the channel discord v14
		if (!channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages)) {
			return await interaction.reply({ content: `I don't have permission to send or read messages in ${channel.name}`, ephemeral: true });
		}
		
		const guild = await Guild.findOne({ id: interaction.guild.id }).catch((err) => console.log(err));
		if (!guild) {
			guild = new Guild({
				id: interaction.guild.id,
			});
		}
		guild.logChannelId = channel.id;
		guild.save().catch((err) => console.log(err));

		await interaction.reply({ content: `Log channel set to ${channel.name}`, ephemeral: true });
		channel.send({ content: `This channel is now set as the log channel for this server.
		To disable logging, run \`/logchannel\` with no arguments.
		To change the log channel, run \`/logchannel\` again with the new channel.

		**Note:** If you delete this channel, logging will be disabled.
		**Note:** If you removed read/write permission for me in this channel, logging will be disabled.

		by default, I will log message edits and deletions of all channels I have read permissions in.
		to change this, use \`/list\` and \`/listtype\` commands.

		use \`/list\` to add or remove channels from the list.
		use \`/listtype\` to change the list type to black list or white list.

		**Note:** current list type is ${guild.listType == 0? `black` : `white`} list and has ${guild.list.length} channels in it.
		` });


	},
};