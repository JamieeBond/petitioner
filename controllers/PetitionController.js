const Petitions = require('../models/Petitions');
const Users = require('../models/Users');
const PetitionValidator = require('../validator/PetitionValidator');
const ObjectId = require('mongodb').ObjectId;

const PetitionController = {
    async add(req, res) {
        const {title, signaturesNeeded, description} = req.body;
        const user = req.user;
        // validation
        let errors = PetitionValidator.addPetition(title, signaturesNeeded, description);
        // if validation fails, render messages
        if (errors.length > 0) {
            res.render('petition/add', {
                errors,
                title,
                signaturesNeeded,
                description
            })
        } else {
            // validation passed save petition
            try {
                const newPetition = await new Petitions({
                    title: title,
                    signaturesNeeded: signaturesNeeded,
                    description: description,
                    createdBy: user._id,
                    signatures: [user._id]
                })
                await newPetition.save();
                await user.petitions.push(newPetition);
                await user.save();
                req.flash('success_msg', 'Petition Added');
                res.redirect('/user/dashboard');
            } catch (error) {
                    console.error(error);
            }
        }
    },
    async search(req, res) {
        const string = req.query.string;

        // create search regex, ignore order of words and case insensitive
        let words = string.split(' ');
        let searchString = "";
        words.forEach(word => searchString += "(?=.*"+word+")");
        let regex = new RegExp(searchString, "i");

        // search
        try {
            let petitions = await Petitions.find({ title: regex})
            res.json(petitions);
        } catch (error) {
            console.error(error);
        }
    },
    async view(req, res) {
        const petition = await Petitions.findOne({"_id" : ObjectId(req.params.id)});
        const createdBy = await Users.findOne({"_id" : ObjectId(petition.createdBy)});
        res.render('petition/view', {
            petition: petition,
            createdBy: createdBy,
            user: req.user
        })
    }
};

/**
 * Socket IO when the Add/Remove Signature button is clicked
 */

io.on( "connection", function(socket) {
    socket.on("signature", function(data) {
        updateSignatures(data['petition'], data['user']).then(function(petition){
            io.sockets.emit("signature-refresh"+data['petition'],{
                'signatures' : petition.signatures.length,
                'signaturesNeeded' : petition.signaturesNeeded,
                'signedUser' : data['user']
            });
        });
    });
});

/**
 * Add/Remove Signature
 */

async function updateSignatures(petitionsId, userId) {
    try {
        let petition = await Petitions.findOne({"_id": ObjectId(petitionsId)});
        if (petition.signatures.includes(userId)) {
            await petition.signatures.pull({"_id": userId});
        } else {
            await petition.signatures.push({"_id": userId});
        }
        await petition.save()
        return petition;
    } catch (error) {
        console.error(error);
    }
}

module.exports = PetitionController;

