var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var logSchema = new  mongoose.Schema({
	date: String,
  message:String,
});
mongoose.model('Log',logSchema);

module.exports =mongoose.model('Log');
