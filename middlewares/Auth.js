module.exports = function(req,res,next)
{
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/User')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var authConfig = require('../configs/authConfig');
var token = req.headers['x-access-token'];
if(token)
{
  jwt.verify(token, authConfig.secret, function(err, decoded) {
    if(!err)
    {
      User.findById(decoded.id, function (err, user) {
        if(!err&&user)
        {
          res.locals.user=user;
        }
          next();
      });
    }
    else
      next();
  });
}
else
  next();
}
