const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all of my commands or info about a specific command.'),
    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle('**Help Command - Chat Observer Bot**')
            .setDescription(`Greetings! I'm Chat Observer, a unique bot designed to keep a watchful eye on your Discord server messages. Here's a quick guide to get you started:`)
            .addFields(
                {
                    name: "**Required Permissions:**",
                    value: `- **Bot Permissions:**
                    - Read Messages (Required to observe messages)
                    - Send Messages (Required in the designated channel to send logs)
                  
                  - **User Permissions (For Managing Bot):**
                    - Manage Messages
                    - Manage Channels
                    - Manage Server`,
                    inline: false
                },
                {
                    name: "*Log Channel:**",
                    value: `The log channel is where all the magic happens! This is where the bot sends its detailed logs.
                    To set the log channel, simply use the `/logchannel` command.`
                },
                {
                    name: "**List:**",
                    value: `The list is the collection of channels I'll be observing. Here's how you can manage it:

                    - **Add Channel to List:**
                      - Use \`/list add [channel]\` to add a specific channel to the observation list.
                    
                    - **Remove Channel from List:**
                      - Use \`/list remove [channel]\` to take a channel off the list.
                    
                    - **Change List Type:**
                      - Use \`/list type [Black List/White List]\` to switch between list types.
                    
                    - **Show List and Type:**
                      - Type \`/list show\` to see the current list type and the channels in it`
                },
                {
                    name: "**Default Settings:",
                    value: `By default, I keep an eye on all channels where I can read messages. The list starts empty, and the default list type is Black List.
                    
                    Now you're all set! If you ever need assistance or want to tweak settings, just give me a shout. Happy chatting!`
                }

            )
            .setColor('#0000ff')
            .setFooter({
                text: "Chat Observer",
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });

    },
};