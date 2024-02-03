const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');


const commands = [];
const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    commands.push({
        "name":file.split('.')[0],
        "value":file.split('.')[0]
})
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all of my commands or info about a specific command.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to get help for')
                .setRequired(false)
                .addChoices(...commands)
        ),
    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle('**Help Command - Formova**')
            .setDescription(`Greetings! I'm Formova, a unique bot designed to keep a watchful eye on your Discord server messages. Here's a quick guide to get you started:`)

        const commandName = interaction.options.getString('command');


        if (!commandName) {
            for (const command of client.commands) {
                embed.addFields({
                    name: `/${command[1].data.name}`,
                    value: command[1].data.description
                
                });
            }
        }
        else {
            const command = client.commands.get(commandName);
            if (!command) {
                return await interaction.reply({ content: 'That\'s not a valid command!', ephemeral: true });
            }
            embed.setTitle(`**/${command.data.name} Command**`);
            embed.setDescription(command.data.description);

            if (command.help.options) {
                for (const option of command.help.options) {
                    embed.addFields({
                        name: `/${command.data.name} ${option.name}`,
                        value: `${option.description}\nUsage: ${option.usage}`,
                    });
                }
            }
        }

        embed.setColor('#0000FF')
        .setFooter({
            text: client.user.username,
            iconURL: client.user.avatarURL(),
        })
        .setTimestamp();


        await interaction.reply({ embeds: [embed], ephemeral: true });


    },
    help: {
        name: 'help',
        description: 'List all of my commands or info about a specific command.',
        options : [
            {
                name: 'command',
                description: 'The command to get help for',
                usage: '/help [command]',
            }
        ]
    }

};