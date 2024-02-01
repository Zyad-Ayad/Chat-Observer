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
        

	},
};  