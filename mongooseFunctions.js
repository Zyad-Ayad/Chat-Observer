const Guild = require('./models/guild.js');

const getGuild = async (guildId) => {
    let guild = await Guild.findOne({ id: guildId }).catch((err) => console.log(err));

    if (guild)
        return guild;

    guild = new Guild({
        id: guild
    });

    await guild.save().catch((err) => console.log(err));
    return guild;
};

module.exports = { getGuild };

