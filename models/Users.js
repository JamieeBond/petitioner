const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;