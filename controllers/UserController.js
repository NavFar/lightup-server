var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/User')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var authConfig = require('../configs/authConfig');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//  ____            _     _
// |  _ \ ___  __ _(_)___| |_ ___ _ __
// | |_) / _ \/ _` | / __| __/ _ \ '__|
// |  _ <  __/ (_| | \__ \ ||  __/ |
// |_| \_\___|\__, |_|___/\__\___|_|
//           |___/
router.post('/register', function(req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  User.create({
    name : req.body.name,
    username : req.body.username,
    password : hashedPassword,
    role : 'user'
  },
  function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user.")
    res.status(200).send({'stat':'ok'});
  });
});
//           _  __
//  ___  ___| |/ _|
// / __|/ _ \ | |_
// \__ \  __/ |  _|
// |___/\___|_|_|
router.post('/self', function(req, res) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({message: 'No token provided.' });
  jwt.verify(token, authConfig.secret, function(err, decoded) {
    if (err) return res.status(500).send({ message: 'Failed to authenticate token.' });

    User.findById(decoded.id, function (err, user) {
      if (err) return res.status(500).send("There was a problem finding the user.");
      if (!user) return res.status(404).send("No user found.");

      res.status(200).send({
        'name':user.name,
        'username':user.username
      });
    });
  });
});
//
//  _                _
// | |    ___   __ _(_)_ __
// | |   / _ \ / _` | | '_ \
// | |__| (_) | (_| | | | | |
// |_____\___/ \__, |_|_| |_|
//            |___/
router.post('/login', function(req, res) {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    var token = jwt.sign({ id: user._id }, authConfig.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ token: token });
  });
});



module.exports = router;