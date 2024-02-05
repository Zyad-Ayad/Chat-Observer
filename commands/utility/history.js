const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const Message = require('../../models/message.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('history')
        .setDescription('Show the history of a message maximun 9 edits.')
        .addStringOption(option =>
            option.setName('messageid')
                .setDescription('The ID of the messag to show the history of')
                .setRequired(true)),

    async execute(interaction) {

        const messageID = interaction.options.getString('messageid');
        const message = await Message.findOne({ id: messageID }).catch((err) => console.log(err));
        if (!message) {
            return await interaction.reply({ content: `Message not found or expired`, ephemeral: true });
        }

        // if user is not the author of the message and doesn't have MANAGE_MESSAGES permission return
        if (message.authorId != interaction.member.id && !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return await interaction.reply({ content: `You don't have permission to view this message history, you must be the author of the message or have MANAGE_MESSAGES permission`, ephemeral: true });
        }

        // fetch author 
        const author = await client.users.fetch(message.authorId).catch((err) => console.log(err));

        if (!author) {
            return await interaction.reply({ content: `Author not found`, ephemeral: true });
        }

        // create embed of created message

        const messageDetails = new EmbedBuilder()
            .setTitle("Message Details :receipt:")
            .addFields(
                {
                    name: "Author username",
                    value: author.username,
                    inline: true
                },
                {
                    name: "Author displayName",
                    value: author.displayName,
                    inline: true
                },
                {
                    name: "Author ID",
                    value: author.id,
                    inline: true
                },
                {
                    name: "Message ID",
                    value: message.id,
                    inline: true
                },
                {
                    name: "Channel",
                    value: `<#${message.channelId}>`,
                    inline: true
                },
                {
                    name: "Go to message context",
                    value: `[Click here](https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id})`,
                    inline: true
                },
                {
                    name: "Deleted",
                    value: message.deleted ? "Yes" : "No",
                    inline: false
                },

            )
            .setColor("#0000ff")
            .setFooter({
                text: client.user.username,
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp();

        // create array of embeds of message edits
        let embeds = [];

        // add the first message
        embeds.push(messageDetails);

        for (let i = 0; i < message.updates.length; i++) {
            const update = message.updates[i];
            const embed = new EmbedBuilder()
                .setTitle(`Message edit ${i + 1}`)
                .addFields(
                    {
                        name: "Update Date - Time",
                        value: update.createdAt.toUTCString(),
                        inline: true
                    },
                )
                .setColor("#ffa200")
                .setFooter({
                    text: client.user.username,
                    iconURL: client.user.avatarURL(),
                })
                .setTimestamp();

            if (!update.content) {
                embed.setDescription("No content");
            }
            else {
                embed.setDescription(update.content);
            }

            const attachments = update.attachments.map(attachment => {
                return attachment.url;
            });

            embed.addFields({
                name: "Attachments",
                value: attachments.join("\n") || "No attachments",
                inline: false
            });

            embeds.push(embed);

        }

        // add current content embed

        const currentContent = new EmbedBuilder()
            .setTitle(`Current Content`)
            .addFields(
                {
                    name: "Update Date - Time",
                    value: message.createdAt.toUTCString(),
                    inline: true
                },
            )
            .setColor("#ffa200")
            .setFooter({
                text: client.user.username,
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp();

        if (!message.content) {
            currentContent.setDescription("No content");
        }
        else {
            currentContent.setDescription(message.content);
        }

        const attachments = message.attachments.map(attachment => {
            return attachment.url;
        });

        currentContent.addFields({
            name: "Attachments",
            value: attachments.join("\n") || "No attachments",
            inline: false
        });

        embeds.push(currentContent);

        // send the embeds
        await interaction.reply({ embeds: embeds }).catch((err) => console.log(err));





    }
}