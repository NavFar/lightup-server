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
    return res.status(400).send();
  if(!res.locals.user)
    return res.status(401).send();
  if(res.locals.user.role!="admin")
    return res.status(403).send();
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
            return res.status(200).send();
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
    return res.status(400).send({ });
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    var token = jwt.sign({ id: user._id }, authConfig.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    return res.status(200).send({ token: token });
  });
});

//  ____ _
// / ___| |__   __ _ _ __   __ _  ___
// | |   | '_ \ / _` | '_ \ / _` |/ _ \
// | |___| | | | (_| | | | | (_| |  __/
// \____|_| |_|\__,_|_| |_|\__, |\___|
//                          |___/
//  ____                                     _
// |  _ \ __ _ ___ _____      _____  _ __ __| |
// | |_) / _` / __/ __\ \ /\ / / _ \| '__/ _` |
// |  __/ (_| \__ \__ \\ V  V / (_) | | | (_| |
// |_|   \__,_|___/___/ \_/\_/ \___/|_|  \__,_|
router.post('/changepassword', function(req, res) {
  if(!req.body.password || !req.body.newpassword)
    return res.status(400).send();
  if(!res.locals.user)
    return res.status(401).send();
  var passwordIsValid = bcrypt.compareSync(req.body.password, res.locals.user.password);
  if(!passwordIsValid)
    return res.status(406).send();
  res.locals.user.password = bcrypt.hashSync(req.body.newpassword, 8);
  res.locals.user.save(
    function (err, updateUser) {
      if(err)
       return res.status(500).send();
      return res.status(200).send();
    }
  );
});
//  ___          _       _           _
// |_ _|___     / \   __| |_ __ ___ (_)_ __
//  | |/ __|   / _ \ / _` | '_ ` _ \| | '_ \
//  | |\__ \  / ___ \ (_| | | | | | | | | | |
// |___|___/ /_/   \_\__,_|_| |_| |_|_|_| |_|
//

router.post('/isadmin', function(req, res) {
  if(!res.locals.user)
    return res.status(401).send();
  if(res.locals.user.role=="admin")
    return res.status(200).send({"admin":true});
  return res.status(200).send({"admin":false});
  });

//     _    _ _   _   _
//    / \  | | | | | | |___  ___ _ __ ___
//   / _ \ | | | | | | / __|/ _ \ '__/ __|
//  / ___ \| | | | |_| \__ \  __/ |  \__ \
// /_/   \_\_|_|  \___/|___/\___|_|  |___/
router.post('/all', function(req, res) {
  if(!req.body.offset||isNaN(req.body.offset))
    return res.status(400).send();
    if(!req.body.limit||isNaN(req.body.limit))
      return res.status(400).send();
  if(!res.locals.user)
    return res.status(401).send();
  if(res.locals.user.role!="admin")
    return res.status(406).send();
   User.find({}).skip(Number(req.body.offset)).limit(Number(req.body.limit)).exec(function(err,users)
 {
   if(err)
    return res.status(500).send();
   var response=[];
   for(var i =0;i<users.length;i++)
    response.push({'name':users[i].name,'username':users[i].username});
   return res.status(200).send(response);
 });
});
//  ____       _      _         _   _
// |  _ \  ___| | ___| |_ ___  | | | |___  ___ _ __
// | | | |/ _ \ |/ _ \ __/ _ \ | | | / __|/ _ \ '__|
// | |_| |  __/ |  __/ ||  __/ | |_| \__ \  __/ |
// |____/ \___|_|\___|\__\___|  \___/|___/\___|_|
//
router.post('/delete', function(req, res) {
  if(!req.body.username)
    return res.status(400).send();
  if(!res.locals.user)
    return res.status(401).send();
  if(res.locals.user.role!="admin")
    return res.status(406).send();
  if(req.body.username==rex.locals.user.username)
    return res.status(400).send();
  User.findOneAndRemove({'username':req.body.username},function(err){
    if(err)
      return res.status(500).send();
    return res.status(200).send();
  });
});
//  _   _                  ____                  _
// | | | |___  ___ _ __   / ___|___  _   _ _ __ | |_
// | | | / __|/ _ \ '__| | |   / _ \| | | | '_ \| __|
// | |_| \__ \  __/ |    | |__| (_) | |_| | | | | |_
//  \___/|___/\___|_|     \____\___/ \__,_|_| |_|\__|
router.post('/count', function(req, res) {
  if(!res.locals.user)
    return res.status(401).send();
  if(res.locals.user.role!="admin")
    return res.status(406).send();
  User.countDocuments({},function(err,count){
    if(err)
      return res.status(500).send();
    return res.status(200).send({count:count});
  });
});


module.exports = router;
