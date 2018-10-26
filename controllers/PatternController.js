var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Pattern = require('../models/Pattern')
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//  ____       _   _                     ____                  _
// |  _ \ __ _| |_| |_ ___ _ __ _ __    / ___|___  _   _ _ __ | |_
// | |_) / _` | __| __/ _ \ '__| '_ \  | |   / _ \| | | | '_ \| __|
// |  __/ (_| | |_| ||  __/ |  | | | | | |__| (_) | |_| | | | | |_
// |_|   \__,_|\__|\__\___|_|  |_| |_|  \____\___/ \__,_|_| |_|\__|
router.post('/count', function(req, res) {
  if(!res.locals.user)
    return res.status(401).send();
  Pattern.countDocuments({},function(err,count){
    if(err)
      return res.stauts(500).send();
    return res.status(200).send({count:count});
  });
});
//     _    _ _   ____       _   _
//    / \  | | | |  _ \ __ _| |_| |_ ___ _ __ _ __  ___
//   / _ \ | | | | |_) / _` | __| __/ _ \ '__| '_ \/ __|
//  / ___ \| | | |  __/ (_| | |_| ||  __/ |  | | | \__ \
// /_/   \_\_|_| |_|   \__,_|\__|\__\___|_|  |_| |_|___/
router.post('/all', function(req, res) {
  if(!req.body.offset||isNaN(req.body.offset))
    return res.status(400).send();
    if(!req.body.limit||isNaN(req.body.limit))
      return res.status(400).send();
  if(!res.locals.user)
    return res.status(401).send();
   Pattern.find({}).skip(Number(req.body.offset)).limit(Number(req.body.limit)).exec(function(err,patterns)
 {
   if(err)
    return res.status(500).send();
   var response=[];
   for(var i =0;i<patterns.length;i++)
    response.push({'name':patterns[i].name,'id':patterns[i]._id,'active':patterns[i].active});
   return res.status(200).send(response);
 });
});
//     _       _     _   ____       _   _
//    / \   __| | __| | |  _ \ __ _| |_| |_ ___ _ __ _ __
//   / _ \ / _` |/ _` | | |_) / _` | __| __/ _ \ '__| '_ \
//  / ___ \ (_| | (_| | |  __/ (_| | |_| ||  __/ |  | | | |
// /_/   \_\__,_|\__,_| |_|   \__,_|\__|\__\___|_|  |_| |_|
router.post('/add', function(req, res) {
  for(var i=0;i<req.body.criteria.length;i++)
  {
    if(!req.body.criteria[i].id||!req.body.criteria[i].value)
        return res.status(400).send();
  }
  if(!req.body.name)
    return res.status(400).send();
  if(!res.locals.user)
    return res.status(401).send();
  Pattern.create({
    name: req.body.name,
    active : false,
    criteria: req.body.criteria
  },function(err){
    if(err)
      return res.status(500).send();
    return res.status(200).send();
  });
});

//  ____       _      _         ____       _   _
// |  _ \  ___| | ___| |_ ___  |  _ \ __ _| |_| |_ ___ _ __ _ __
// | | | |/ _ \ |/ _ \ __/ _ \ | |_) / _` | __| __/ _ \ '__| '_ \
// | |_| |  __/ |  __/ ||  __/ |  __/ (_| | |_| ||  __/ |  | | | |
// |____/ \___|_|\___|\__\___| |_|   \__,_|\__|\__\___|_|  |_| |_|
router.post('/delete', function(req, res) {
  if(!req.body.id)
    return res.status(400).send();
  if(!res.locals.user)
    return res.status(401).send();
  if(req.body.username==rex.locals.user.username)
    return res.status(400).send();
  Pattern.findOneAndRemove({'_id':req.body.id},function(err){
    if(err)
      return res.status(500).send();
    return res.status(200).send();
  });
});
//     _        _   _            _         ____       _   _
//    / \   ___| |_(_)_   ____ _| |_ ___  |  _ \ __ _| |_| |_ ___ _ __ _ __
//   / _ \ / __| __| \ \ / / _` | __/ _ \ | |_) / _` | __| __/ _ \ '__| '_ \
//  / ___ \ (__| |_| |\ V / (_| | ||  __/ |  __/ (_| | |_| ||  __/ |  | | | |
// /_/   \_\___|\__|_| \_/ \__,_|\__\___| |_|   \__,_|\__|\__\___|_|  |_| |_|
router.post('/activate', function(req, res) {
  if(!res.locals.user)
    return res.status(401).send();
  if(!req.body.id)
    return res.status(400).send();
  Pattern.find({"_id":req.body.id},function(err,pattern){
    if(err)
      return res.status(500).send();
    pattern.save
  });

});


module.exports = router;
