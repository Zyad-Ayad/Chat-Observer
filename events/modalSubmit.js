const { Events } = require('discord.js');
const Ticket = require('../models/ticket.js');
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
        if (!interaction.isModalSubmit()) return;

        const modalid = interaction.customId;

        if (modalid == 'contact_modal') {


            // get submitted tickets by the user and if they have any pending tickets then don't allow them to submit another ticket
            const tickets = await Ticket.find({ userID: interaction.user.id, replied: false }).catch((err) => console.log(err));
            if (tickets.length > 0) {
                await interaction.reply({ content: 'You already have a pending ticket. Please wait for a response before submitting another ticket.', ephemeral: true });
                return;
            }

            const message = interaction.fields.getTextInputValue('contact_input');
            
            const ticket = new Ticket({
                userID: interaction.user.id,
                message: message
            });
            ticket.save().catch((err) => console.log(err));
            await interaction.reply({ content: 'Your message has been sent. We will get back to you soon!', ephemeral: true });
        }



    }
};