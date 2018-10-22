var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Log = require('../models/Log')
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/all', function(req, res) {
  if(!res.locals.user)
    return res.status(401).send();
  if(res.locals.user.role!="admin")
    return res.status(406).send();
  Log.find({},function(err,logs){
    if(err)
    return res.status(500).send();
    var response = [];
    for(var i=0;i<logs.length;i++){
      response.push({'date':logs[i].date,'message':logs[i].message,'author':logs[i].author});
    }
    return res.status(200).send(response);
  });
});


module.exports = router;
