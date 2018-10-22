var mongoose =require('mongoose');
var logSchema = new  mongoose.Schema({
	date: Date,
  message:String,
  author:String
});
mongoose.model('Log',logSchema);

module.exports =mongoose.model('Log');
