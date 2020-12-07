require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const io = require("socket.io")();
global.io = io;


app = express();
app.io = io;
require('./middleware/Passport')(passport);

/**
 * Connect to Mongo
 */

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true})
    .then(() => console.log('MongoDB Connected'))
    .catch(error => console.log(error));

/**
 * View engine setup
 */

app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Logging
 */

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Express session
 */

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

/**
 * Passport middleware
 */

app.use(passport.initialize());
app.use(passport.session());


/**
 * Global flash messages
 */

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/petition', require('./routes/petition'));

/**
 * Catch 404 and forward to error handler
 */

app.use(function(req, res, next) {
    next(createError(404));
});

/**
 * Error handler
 */

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
