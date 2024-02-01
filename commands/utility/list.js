const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const Guild = require('../../models/guild.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('manage channels list.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('type')
                .setDescription('change list type')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('list type')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Black List', value: 'black' },
                            { name: 'White List', value: 'white' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('add channel to list')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to add')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('remove channel from list')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to remove')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription('show list'))

        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageGuild),
    async execute(interaction) {

        let guild = await Guild.findOne({ id: interaction.guild.id }).catch((err) => console.log(err));
        if (!guild) {
            guild = new Guild({
                id: interaction.guild.id,
            });
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand == "type") {
            const type = interaction.options.getString('type');
            if (type == "black") {
                guild.listType = 0;
                guild.save().catch((err) => console.log(err));
                return await interaction.reply({ content: `List type changed to black list`, ephemeral: true });
            }
            else if (type == "white") {
                guild.listType = 1;
                guild.save().catch((err) => console.log(err));
                return await interaction.reply({ content: `List type changed to white list`, ephemeral: true });
            }
        }
        else if (subcommand == "add") {
            const channel = interaction.options.getChannel('channel');
            if (!channel) {
                return await interaction.reply({ content: `Please provide a channel`, ephemeral: true });
            }
            if (guild.list.includes(channel.id)) {
                return await interaction.reply({ content: `Channel ${channel.name} is already in the list`, ephemeral: true });
            }
            guild.list.push(channel.id);
            guild.save().catch((err) => console.log(err));
            return await interaction.reply({ content: `Channel ${channel.name} added to the list`, ephemeral: true });
        }
        else if (subcommand == "remove") {
            const channel = interaction.options.getChannel('channel');
            if (!channel) {
                return await interaction.reply({ content: `Please provide a channel`, ephemeral: true });
            }
            if (!guild.list.includes(channel.id)) {
                return await interaction.reply({ content: `Channel ${channel.name} is not in the list`, ephemeral: true });
            }
            guild.list.splice(guild.list.indexOf(channel.id), 1);
            guild.save().catch((err) => console.log(err));
            return await interaction.reply({ content: `Channel ${channel.name} removed from the list`, ephemeral: true });
        }
        else if (subcommand == "show") {
            const embed = new EmbedBuilder()
                .setTitle('List')
                .setDescription(`List type is ${guild.listType == 0 ? `black` : `white`} list and has ${guild.list.length} channels in it.`)
                .setColor('#0000ff')
                .setFooter({
                    text: "Chat Observer",
                    iconURL: client.user.avatarURL(),
                })
                .setTimestamp()
                .addField("Channels", guild.list.length == 0 ? "List is empty" : `<#${guild.list.join(">\n<#")}>`);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }


    },
};