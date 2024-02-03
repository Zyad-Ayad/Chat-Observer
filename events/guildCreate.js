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

        console.log(`Joined a new guild: ${createdGuild.name}`);

        fetch(`https://top.gg/api/bots/1199783232749707344/stats`, {
            method: 'POST',
            headers: {
                'Authorization': process.env.TOPGG_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                server_count: client.guilds.cache.size
            })
        }).then(res => res.json()).catch(console.error);
        

	},
};  