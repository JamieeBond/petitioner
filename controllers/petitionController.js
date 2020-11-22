const Petitions = require('../models/Petitions');
const Users = require('../models/Users');
const ObjectId = require('mongodb').ObjectId;

const petitionController = {
    async add(req, res) {
        const {title, signaturesNeeded, description} = req.body;
        const user = req.user;

        let errors = []

        // check required fields
        if (!title || !signaturesNeeded || !description) {
            errors.push({msg: 'Please enter all fields'});
        }

        if (description && !isNaN(description)) {
            errors.push({msg: 'Signatures needed must be a number'});
        }

        // if validation fails, render messages
        if (errors.length > 0) {
            res.render('petition/add', {
                errors,
                title,
                signaturesNeeded,
                description
            })
        } else {
            // validation passed
            const newPetition = new Petitions({
                title: title,
                signaturesNeeded: signaturesNeeded,
                description: description,
                createdBy: user._id
            })

            // save petition
            await newPetition.save()
                .then(petition => {
                    // push petition to user collection
                    user.petitions.push(petition)
                     user.save()
                        .then(user => {
                            req.flash('success_msg', 'Petition Added');
                            res.redirect('/user/dashboard');
                        })
                        .catch(error => console.log(error));
                })
                .catch(error => console.log(error));
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
        await Petitions.find( { title: regex} )
            .then(petitions => {
                res.json(petitions);
            })
            .catch(error => console.log(error));
    },
    async view(req, res) {

        const petition = await Petitions.findOne({"_id" : ObjectId(req.params.id)});
        const createdBy = await Users.findOne({"_id" : ObjectId(petition.createdBy)});
        res.render('petition/view', {
            petition: petition,
            createdBy: createdBy
        })
    }
};

module.exports = petitionController;

