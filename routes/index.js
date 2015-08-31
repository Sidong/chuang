var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  	res.render('index');
});

router.get('/index', function(req, res) {
  	res.render('index');
});

router.get('/product', function(req, res) {
  	res.render('product');
});

router.get('/team', function(req, res) {
  	res.render('team');
});

router.get('/detail', function(req, res) {
  	res.render('detail');
});

module.exports = router;