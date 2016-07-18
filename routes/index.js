var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/room/count/:id',function(req,res) {
  var redis = require('../service/redisdb');
  var jsHelper = require('../lib/jsonhelper');
  var roomId = req.params.id;
  var count = 0;
  redis.getUsers(roomId,function(error, users) {
        if(error){
          console.log(error);
        }else{
          count =jsHelper.getJSONLength(users);
          console.log(users);
        }
        res.send(count.toString());
  });
})
module.exports = router;
