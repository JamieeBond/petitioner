const express = require('express');
const router = express.Router();
const Auth = require('../middleware/Auth');

// home page
router.get('/', Auth.optionalAuthenticated, function(req, res, next) {
  res.render('index', {user: req.user});
});

module.exports = router;
