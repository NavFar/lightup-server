var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/User')
var authConfig = require('../configs/authConfig');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/register', function(req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  User.create({
    name : req.body.name,
    username : req.body.username,
    password : hashedPassword
  },
  function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user.")
    var token = jwt.sign({ id: user._id }, authConfig.secret, {
      expiresIn: 86400
    });
    res.status(200).send({ token: token });
  });
});

module.exports = router;
