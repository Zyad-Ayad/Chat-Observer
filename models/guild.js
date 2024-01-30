const mongoose = require('mongoose');
const { Schema } = mongoose;

const guildSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    listType : {
        type: String,
        required: true,
        default: "blacklist"
    },
    list : [String],
    logChannelId : {
        type: String,
        required: true,
        default: ""
    }
}
);

const Guild = mongoose.model('Guild', guildSchema);

module.exports = Guild;