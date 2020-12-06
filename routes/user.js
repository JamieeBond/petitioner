const express = require('express')
const router = express.Router();
const UserController = require('../controllers/UserController');
const Auth = require('../middleware/Auth');

// login
router.get('/login', (req, res) => res.render('user/login'));
router.post('/login', UserController.login);

// register
router.get('/register', (req, res) => res.render('user/register'))
router.post('/register', UserController.register);

// logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged out');
    res.redirect('/user/login');
});

router.get('/dashboard', Auth.ensureAuthenticated, UserController.dashboard);

module.exports = router;