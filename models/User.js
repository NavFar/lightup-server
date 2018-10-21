var mongoose =require('mongoose');
var userSchema = new  mongoose.Schema({
	name:String,
	username:String,
	password:String,
	role:String
});
mongoose.model('User',userSchema);

module.exports =mongoose.model('User');
