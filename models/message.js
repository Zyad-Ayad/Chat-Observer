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
    createdAt: {
        type: Date,
        required: true,
    },
    content: {
        type: String,
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
        createdAt : {
            type: Date,
            required: true
        },
        attachments : [{
            url : {
                type: String,
                required: true
            },
            _id : false
        }],
        _id : false
    }],
    attachments : [{
        url : {
            type: String,
            required: true
        },
        _id : false
    }],
    expireAt: {
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000, // Set default expiration to 1 day (24 hours)
        index: { expires: 0 },
    }
}
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;