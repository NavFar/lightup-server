var reader ={
  read:function(portNum){
    var gpio = require('onoff').Gpio;
    var port = new gpio(portNum, 'in');
    port.watch(function(err,value)
  {
    if(err)
      return -1;
    return value;
  });
  }
}
module.exports = reader;
