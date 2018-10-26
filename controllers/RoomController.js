var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Room = require('../models/Room');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//     _    _ _   ____
//    / \  | | | |  _ \ ___   ___  _ __ ___  ___
//   / _ \ | | | | |_) / _ \ / _ \| '_ ` _ \/ __|
//  / ___ \| | | |  _ < (_) | (_) | | | | | \__ \
// /_/   \_\_|_| |_| \_\___/ \___/|_| |_| |_|___/
//
router.post('/all', function(req, res) {
  if(!req.body.offset||isNaN(req.body.offset))
    return res.status(400).send();
  if(!req.body.limit||isNaN(req.body.limit))
    return res.status(400).send();
  // if(!res.locals.user)
  //   return res.status(401).send();
  // if(res.locals.user.role!="admin")
  //   return res.status(406).send();
    Room.find({}).skip(Number(req.body.offset)).limit(Number(req.body.limit)).exec(function(err,rooms)
  {
    if(err)
     return res.status(500).send();
    var response=[];
    for(var i =0;i<rooms.length;i++)
     response.push({
       'name':rooms[i].name,
       'id':rooms[i]._id,
   });
    return res.status(200).send(response);
  });
});
//  ____                          ____                  _
// |  _ \ ___   ___  _ __ ___    / ___|___  _   _ _ __ | |_
// | |_) / _ \ / _ \| '_ ` _ \  | |   / _ \| | | | '_ \| __|
// |  _ < (_) | (_) | | | | | | | |__| (_) | |_| | | | | |_
// |_| \_\___/ \___/|_| |_| |_|  \____\___/ \__,_|_| |_|\__|
router.post('/count', function(req, res) {
  if(!res.locals.user)
    return res.status(401).send();
  if(res.locals.user.role!="admin")
    return res.status(406).send();
  Room.countDocuments({},function(err,count){
    if(err)
      return res.stauts(500).send();
    return res.status(200).send({count:count});
  });
});
//     _       _     _   ____
//    / \   __| | __| | |  _ \ ___   ___  _ __ ___
//   / _ \ / _` |/ _` | | |_) / _ \ / _ \| '_ ` _ \
//  / ___ \ (_| | (_| | |  _ < (_) | (_) | | | | | |
// /_/   \_\__,_|\__,_| |_| \_\___/ \___/|_| |_| |_|
router.post('/add', function(req, res) {
  if(!req.body.inputPort||isNaN(req.body.inputPort));
    return res.status(400).send();
  if(!req.body.inputType)
    return res.status(400).send();
  if(!req.body.outputPort||isNaN(req.body.outputPort));
    return res.status(400).send();
  if(!req.body.outputType)
    return res.status(400).send();
  if(!req.body.name)
    return res.status(400).send();
  if(!res.locals.user)
    return res.status(401).send();
  if(res.locals.user.role!="admin")
    return res.status(406).send();
  Room.create({
    name: req.body.name,
    inputPort : req.body.inputPort,
    inputType : req.body.inputType,
    outputPort : req.body.outputPort,
    outputType : req.body.outputType,
  },function(err){
    if(err)
      return res.status(500).send();
    return res.status(200).send();
  });
});
//  ____       _      _         ____
// |  _ \  ___| | ___| |_ ___  |  _ \ ___   ___  _ __ ___
// | | | |/ _ \ |/ _ \ __/ _ \ | |_) / _ \ / _ \| '_ ` _ \
// | |_| |  __/ |  __/ ||  __/ |  _ < (_) | (_) | | | | | |
// |____/ \___|_|\___|\__\___| |_| \_\___/ \___/|_| |_| |_|

router.post('/delete', function(req, res) {
if(!res.locals.user)
  return res.status(401).send();
if(res.locals.user.role!="admin")
  return res.status(406).send();
if(!req.body.id)
  return res.status(400).send();
Room.findOneAndRemove({'_id':req.body.id},function(err){
    if(err)
      return res.status(500).send();
    return res.status(200).send();
  });
});



module.exports = router;
