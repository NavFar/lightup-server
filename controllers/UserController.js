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

  if(!req.body.password || !req.body.username|| !req.body.name)
    res.status(400).send();
  if(!res.locals.user)
    res.status(401).send();
  if(res.locals.user.role!="admin")
    res.status(403).send();
    User.findOne({username:req.body.username},function(err,user){
      if(user)
      return res.status(400).send({message: 'duplicate' });
      else {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        User.create({
            name : req.body.name,
            username : req.body.username,
            password : hashedPassword,
            role : 'user'
          },
          function (err, user) {
            if (err) return res.status(500).send("There was a problem registering the user.")
            res.status(200).send();
          });  
      }
    });
});
//           _  __
//  ___  ___| |/ _|
// / __|/ _ \ | |_
// \__ \  __/ |  _|
// |___/\___|_|_|
router.post('/self', function(req, res) {
  if(!res.locals.user)
    return res.status(401).send();
  res.status(200).send({
    'name':res.locals.user.name,
    'username':res.locals.user.username
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
  if(!req.body.password || !req.body.username)
    res.status(400).send({ });
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
router.post('/test', function(req, res) {
  res.send(res.locals);
});


module.exports = router;
