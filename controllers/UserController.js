const bcrypt = require('bcryptjs');
const passport = require('passport');
const Users = require('../models/Users');
const Petitions = require('../models/Petitions');
const UserValidator = require('../validator/UserValidator');

const UserController = {
    async register(req, res) {
        const {name, email, password, passwordCon} = req.body;
        // validation
        let errors = UserValidator.registration(name, email, password, passwordCon);
            // if validation fails, render messages
            if (errors.length > 0) {
                res.render('user/register', {
                    errors,
                    name,
                    email,
                    password,
                    passwordCon
                });
        } else {
            // validation passed
            let user = await Users.findOne({email: email})
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
                try {
                    const newUser = new Users({
                        name: name,
                        email: email,
                        password: password
                    });
                    // hash password
                    await bcrypt.genSalt(10, (error, salt) =>
                        bcrypt.hash(newUser.password, salt, (error, hash) => {
                            if (error) throw error;
                            // set password to hashed
                            newUser.password = hash;
                            // save user
                            newUser.save();
                        })
                    );
                } catch (error) {
                    console.error(error);
                }

                req.flash('success_msg', 'Registration Success');
                res.redirect('/user/login');
            }

        }
    },
    login(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/user/dashboard',
            failureRedirect: '/user/login',
            failureFlash: true
        })(req, res, next);
    },
    async dashboard(req, res) {
        const user = req.user;
        const petitions = await Petitions.find({createdBy: user._id});
        res.render('user/dashboard', {
            user: req.user,
            petitions: petitions
        })
    }
};

module.exports = UserController;