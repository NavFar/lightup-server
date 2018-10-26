var router = {
 controllers : "../controllers/",
add:function(app){
  app.use('/user',require(this.controllers+'UserController'));
  app.use('/log',require(this.controllers+'LogController'));
  app.use('/room',require(this.controllers+'RoomController'));
}
};
module.exports = router;
