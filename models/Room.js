var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var roomSchema = new  mongoose.Schema({
name:String,
inputPort:Number,
inputType:String,
outputPort:Number,
outputType:String,
});
mongoose.model('Room',roomSchema);

module.exports =mongoose.model('Room');
