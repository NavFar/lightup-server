var express = require('express');
var app = express();
// var router = require('./configs/router');
var dbConfig = require('./configs/dbConfig');
var mongoose = require('mongoose');
// mongoose.connect('mongodb://'+dbConfig.user+':'+dbConfig.db_passowrd+'@'+dbConfig.db_url+':'+dbConfig.db_port+'/'+dbConfig.db_name);
mongoose.connect('mongodb://'+dbConfig.db_url+':'+dbConfig.db_port+'/'+dbConfig.db_name,{ useNewUrlParser: true });
// router.add(app);
var portNumber = 3000;
app.listen(portNumber,function()
{
  console.log("Server is listening to port"+portNumber);
}
)
