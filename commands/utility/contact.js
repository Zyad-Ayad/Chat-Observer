const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('contact')
        .setDescription('Send a message to the bot developers.'),
    async execute(interaction) {

        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId('contact_modal')
            .setTitle('Contact Form');

        // Add the text input
        const textInput = new TextInputBuilder()
            .setCustomId('contact_input')
            .setPlaceholder('Type your message here...')
            .setMinLength(10)
            .setMaxLength(1000)
            .setStyle(TextInputStyle.Paragraph)
            .setLabel('Message');

        const actionRow = new ActionRowBuilder().addComponents(textInput);

        modal.addComponents(actionRow);

        // Send the modal
        await interaction.showModal(modal);

    }
};