var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var logSchema = new  mongoose.Schema({
	date: Date,
  message:String,
	author: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});
mongoose.model('Log',logSchema);

module.exports =mongoose.model('Log');
