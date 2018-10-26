var router = {
 controllers : "../controllers/",
 prefix : "/api",
add:function(app){
  app.use(this.prefix+'/user',require(this.controllers+'UserController'));
  app.use(this.prefix+'/log',require(this.controllers+'LogController'));
  app.use(this.prefix+'/room',require(this.controllers+'RoomController'));
  app.use(this.prefix+'/pattern',require(this.controllers+'PatternController'));
}
};
module.exports = router;
