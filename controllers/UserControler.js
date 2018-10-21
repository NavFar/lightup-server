var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/User')
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
module.exports = router;
