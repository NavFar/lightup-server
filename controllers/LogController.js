var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Log = require('../models/Log')
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/all', function(req, res) {
  if(isNaN(req.body.offset))
    return res.status(400).send();
  if(isNaN(req.body.limit))
    return res.status(400).send();
  if(!res.locals.user)
    return res.status(401).send();
  if(res.locals.user.role!="admin")
    return res.status(406).send();
    Log.find({}).skip(Number(req.body.offset)).limit(Number(req.body.limit)).exec(function(err,logs)
  {
    if(err)
    return res.status(500).send();
    var response = [];
    for(var i=0;i<logs.length;i++){
      response.push({'date':logs[i].date,'message':logs[i].message});
    }
    return res.status(200).send({logs:response});
  });
});

router.post('/count', function(req, res) {
  if(!res.locals.user)
    return res.status(401).send();
  if(res.locals.user.role!="admin")
    return res.status(406).send();
  Log.countDocuments({},function(err,count){
    if(err)
      return res.status(500).send();
    return res.status(200).send({count:count});
  });
});
module.exports = router;
