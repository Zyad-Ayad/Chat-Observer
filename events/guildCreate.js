const { Events } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../models/guild.js');

module.exports = {
	name: Events.GuildCreate,
	async execute(createdGuild) {

		let guild = await Guild.findOne({ id: createdGuild.id }).catch((err) => console.log(err));

        if(!guild)
        {
            guild = new Guild({
                id: createdGuild.id,
            });
            guild.save().catch((err) => console.log(err));
        }

        // send message to guild owner
        const owner = await createdGuild.fetchOwner();
        owner.send("Thanks for adding me to your server! To get started, type `!help` in a channel I can see!").catch((err) => console.log(err));
        

	},
};  