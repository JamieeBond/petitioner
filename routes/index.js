var express = require('express');
var router = express.Router();

// home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Petitioner' });
});

module.exports = router;
