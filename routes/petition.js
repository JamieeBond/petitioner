const express = require('express')
const router = express.Router();
const PetitionController = require('../controllers/PetitionController');
const Auth = require('../middleware/Auth');

// add petition
router.get('/add', Auth.ensureAuthenticated, (req, res) => res.render(
    'petition/add',
    {
        user: req.user
    }
));
router.post('/add', Auth.ensureAuthenticated, PetitionController.add);

// search
router.get('/search', PetitionController.search);

// view petition
router.get('/view/:id',Auth.optionalAuthenticated, PetitionController.view);

// delete petition
router.get('/delete/:id',Auth.optionalAuthenticated, PetitionController.delete);

module.exports = router;