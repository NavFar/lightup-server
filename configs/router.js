var router = {
 controllers : "../controllers/",
add:function(app){
  app.use('/user',require(this.controllers+'UserController'));
}
};
module.exports = router;
