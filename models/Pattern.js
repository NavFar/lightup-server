var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var patternSchema = new  mongoose.Schema({
name:String,
active:Boolean,
criteria:[
  {
    id:String,
    value:Number
  }
]
});
mongoose.model('Pattern',patternSchema);

module.exports =mongoose.model('Pattern');
