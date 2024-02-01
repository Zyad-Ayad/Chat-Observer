const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all of my commands or info about a specific command.'),
    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle('Help')
            .setDescription('Chat observer is a unique bot that observe your discord server messages.')
            .addFields(
                {
                    name : "Required permissions",
                    value : `The bot itself just need to be able to read messages in the channels you want to observe, and send messages in the log channel.
                    But for you to be able to manage the bot, you need to have the following permissions:
                    \`Manage Messages\`, \`Manage Channels\`, \`Manage Server\``,
                    inline : false
                },
                {
                    name : "Log Channel",
                    value : `The log channel is the channel the bot will send the logs to.
                    To set the log channel, use \`/logchannel\` command.`
                },
                {
                    name : "List",
                    value : `The list is the list of channels the bot will observe.
                    To add or remove channels from the list, use \`/list\` command.
                    To swap between black list and white list, use \`/listtype\` command.
                    By default, the bot will observe all channels it has read permissions in. i.e the list is empty and the list type is black list.`
                },
            )
            .setColor('BLUE')
            .setFooter('Chat Observer')
            .addTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });

    },
};