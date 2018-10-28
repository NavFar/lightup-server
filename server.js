var express = require('express');
var app = express();
var router = require('./configs/router');
var dbConfig = require('./configs/dbConfig');
var mongoose = require('mongoose');
var path = require('path');
var watcher = require('./watcher');
var args = process.argv;
var demo = false
for(var i =0;i<args.length;i++){
  if(args[i]=="--noWatcher")
    demo = true;
  }
mongoose.set('useFindAndModify', false);
// mongoose.connect('mongodb://'+dbConfig.user+':'+dbConfig.db_passowrd+'@'+dbConfig.db_url+':'+dbConfig.db_port+'/'+dbConfig.db_name);
mongoose.connect('mongodb://'+dbConfig.db_url+':'+dbConfig.db_port+'/'+dbConfig.db_name,{ useNewUrlParser: true });
app.all('*',require('./middlewares/Auth'));
app.use(express.static(path.join(__dirname, 'public')));
router.add(app);
var portNumber = 3000;
app.listen(portNumber,function()
{
  console.log("Web Server is Listening to Port "+portNumber);
});
if(!demo){
watcher.run();
console.log("Watcher is Running.")
}
