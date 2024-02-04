const { Events } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../models/guild.js');

module.exports = {
    name: Events.GuildCreate,
    async execute(createdGuild) {

        let guild = await Guild.findOne({ id: createdGuild.id }).catch((err) => console.log(err));

        if (!guild) {
            guild = new Guild({
                id: createdGuild.id,
            });
            guild.save().catch((err) => console.log(err));
        }

        console.log(`Joined a new guild: ${createdGuild.name}`);


        // if the bot is in production mode, update the server count on top.gg and discordbotlist.com

        if (process.env.ENV == "PROD") {
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

            fetch(`https://discordbotlist.com/api/v1/bots/1199783232749707344/stats`, {
                method: 'POST',
                headers: {
                    'Authorization': process.env.DBL_TOKEN,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    guilds: client.guilds.cache.size,
                    users: client.users.cache.size
                })
            }).then(res => res.json()).catch(console.error);

            fetch(`https://discord.bots.gg/api/v1/bots/1199783232749707344/stats`, {
                method: 'POST',
                headers: {
                    'Authorization': process.env.DBGG_TOKEN,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    guildCount: client.guilds.cache.size
                })
            }).then(res => res.json()).catch(console.error);
        }


    },
};  