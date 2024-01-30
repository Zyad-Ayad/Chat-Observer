const mongoose = require('mongoose');
const { Schema } = mongoose;

const guildSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    listType : {
        type: String,
        default: "blackList"
    },
    list : [String],
    logChannelId : {
        type: String,
        default: ""
    }
}
);

const Guild = mongoose.model('Guild', guildSchema);

module.exports = Guild;