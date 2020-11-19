const express = require('express')
const router = express.Router();
const petitionController = require('../controllers/petitionController');
const  { ensureAuthenticated } = require('../middleware/auth');

// add petition
router.get('/add', ensureAuthenticated, (req, res) => res.render('petition/add'));
router.post('/add', ensureAuthenticated, petitionController.add);

module.exports = router;