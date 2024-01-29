const mongoose = require('mongoose');
const { Schema } = mongoose;



const messageSchema = new Schema({
    channelId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    id : {
        type: String,
        required: true,
        unique: true
    },
    createdTimestamp: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true,
        default: ""
    },
    authorId : {
        type: String,
        required: true
    },
    deleted : {
        type: Boolean,
        required: true,
        default: false
    },
    updates : [{
        content : {
            type: String,
            required: true
        },
        editTimestamp : {
            type: Number,
            required: true
        },
    }]
}
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;