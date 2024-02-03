const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({
    userID : {
        type: String,
        required: true,
    },
    message : {
        type: String,
        required: true
    },
    replied : {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
);
    

module.exports = mongoose.model('Ticket', ticketSchema);
