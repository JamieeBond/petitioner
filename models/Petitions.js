const mongoose = require('mongoose');

const PetitionSchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    signaturesNeeded: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
})

const Petitions = mongoose.model('Petitions', PetitionSchema);

module.exports = Petitions;