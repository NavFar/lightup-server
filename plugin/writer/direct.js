var reader ={
  writeUp:function(portNum){
    var gpio = require('onoff').Gpio;
    var port = new gpio(portNum, 'out');
    port.writeSync(1);
  },
  writeDown:function(portNum){
    var gpio = require('onoff').Gpio;
    var port = new gpio(portNum, 'out');
    port.writeSync(0);
  }
}
module.exports = reader;
