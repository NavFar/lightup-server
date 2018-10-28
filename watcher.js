var watcher ={
  run:function(){
    setTimeout(this.watch, 10000);
  },
  watch:function(){
    var Room = require('./models/Room');
    var Pattern = require('./models/Pattern');
    Pattern.findOne({active:true},function(err,pattern){
      if(err||!pattern)
        return;
      for(var i=0;i<pattern.criteria.length;i++){
        Room.findOne({_id:pattern.criteria[i].id,function(err,room){
          var reader = require('./plugin/reader/'+room.inputType);
          var value = reader.read(pattern.criteria[i].inputPort);
          var writer = require('./plugin/writer/'+room.outputType);
          var diff = (value-pattern.criteria[i].value>0);
          if(diff>0)
            writer.writeUp(pattern.criteria[i].outputPort)
          else
            writer.writeDown(pattern.criteria[i].outputPort)
        }});
      }
    });
  }
};
module.exports = watcher;
