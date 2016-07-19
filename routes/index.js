var express = require('express');
var async = require('async');
var router = express.Router();
var redis = require('../service/redisdb');
var jsHelper = require('../lib/jsonhelper');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/room/count/:id', function (req, res) {
  
  var roomId = req.params.id;
  var count = 0;
  redis.getUsers(roomId, function (error, users) {
    if (error) {
      console.log(error);
    } else {
      count = jsHelper.getJSONLength(users);
      console.log(users);
    }
    res.send(count.toString());
  });
});
router.get('/api/room/sort', function (req, res) {
  var limit = req.query.limit;

  redis.getAllRomm(function (err, keys) {
	  result = [];
	  var num = keys.length;
	  keys.forEach(function(key) {
		  redis.getUserCount(key, function(err2, count) {
			 num --;
			 result.push([key,count]);
			 if(num == 0){
				res.send(JSON.stringify(jsHelper.sortByValue(result,limit)));	 	
			 } 
		  });
	  });
  });
});

module.exports = router;
