const express = require('express');
const router = express.Router();
const Auth = require('../middleware/Auth');
const Petitions = require('../models/Petitions');

// home page
router.get('/', Auth.optionalAuthenticated, async function(req, res, next) {
    let petitions = await Petitions.find({}).sort({createdOn: 'desc'}).limit(5).exec();
    res.render('index', {
        user: req.user,
        petitions: petitions
    });
});

module.exports = router;
