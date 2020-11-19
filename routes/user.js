const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const  { ensureAuthenticated } = require('../middleware/auth');

// login
router.get('/login', (req, res) => res.render('user/login'));
router.post('/login', userController.login);

// register
router.get('/register', (req, res) => res.render('user/register'))
router.post('/register', userController.register);

// logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged out');
    res.redirect('/user/login');
});

router.get('/dashboard', ensureAuthenticated, userController.dashbboard);

module.exports = router;