const bcrypt = require('bcryptjs');
const passport = require('passport');
const Users = require('../models/Users');
const Petitions = require('../models/Petitions');

const userController = {
    async register(req, res) {
        const {name, email, password, passwordCon} = req.body;
        let errors = []

        // check required fields
        if (!name || !email || !password || !passwordCon) {
            errors.push({ msg: 'Please enter all fields' });
        }

        // check passwords match
        if (password !== passwordCon) {
            errors.push({ msg: 'Passwords do not match' });
        }

        // check password length
        if (password.length < 6) {
            errors.push({ msg: 'Password must be at least 6 characters' });
        }

        // if validation fails, render messages
        if (errors.length > 0) {
            res.render('user/register', {
                errors,
                name,
                email,
                password,
                passwordCon
            })
        } else {
            // validation passed
            Users.findOne({email: email})
                .then(user => {
                    if (user) {
                        // user exists
                        errors.push({msg: 'Email already in use'});
                        res.render('user/register', {
                            errors,
                            name,
                            email,
                            password,
                            passwordCon
                        });
                    } else {
                        const newUser = new Users({
                            name: name,
                            email: email,
                            password: password
                        });
                        // hash password
                        bcrypt.genSalt(10, (error, salt) =>
                            bcrypt.hash(newUser.password, salt, (error, hash) => {
                                if (error) throw error;
                                // set password to hashed
                                newUser.password = hash;
                                // save user
                                newUser.save()
                                    .then(user => {
                                        req.flash('success_msg', 'Registration Success');
                                        res.redirect('/user/login');
                                    })
                                    .catch(error => console.log(error));
                            }))
                    }

                });
        }
    },
    login(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/user/dashboard',
            failureRedirect: '/user/login',
            failureFlash: true
        })(req, res, next);
    },
    async dashbboard(req, res) {
        const user = req.user;
        const petitions = await Petitions.find({createdBy: user._id});
        res.render('user/dashboard', {
            user: req.user,
            petitions: petitions
        })
    }
};

module.exports = userController;