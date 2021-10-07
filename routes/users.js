var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  //next();   is working but it gives some error in console
});

router.get('/cool', function(req, res, next) {
  res.send("I AM SO COOL!");
});


module.exports = router;
