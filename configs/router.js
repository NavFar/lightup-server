var router = {
 controllers : "../controllers/",
add:function(app){
  app.use('/user',require(this.controllers+'UserController'));
  app.use('/log',require(this.controllers+'LogController'));
}
};
module.exports = router;
