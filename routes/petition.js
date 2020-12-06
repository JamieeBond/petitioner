const express = require('express')
const router = express.Router();
const PetitionController = require('../controllers/PetitionController');
const Auth = require('../middleware/Auth');

// add petition
router.get('/add', Auth.ensureAuthenticated, (req, res) => res.render('petition/add'));
router.post('/add', Auth.ensureAuthenticated, PetitionController.add);

// search
router.get('/search', PetitionController.search);

// view petition
router.get('/view/:id',Auth.optionalAuthenticated, PetitionController.view);

module.exports = router;