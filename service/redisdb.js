var redis = require('redis');
var jsHelper = require('../lib/jsonhelper');
var client = redis.createClient('6379', '127.0.0.1');

//错误监控
client.on('error',function(error) {
    console.log(error);
});


exports.add = function (room,key,value) {
    client.hset(room,key,value,function(error,res) {
        if(error){
            console.log(error);
        }
        else{
            console.log(res);
        }
        //client.end(false);
    });
}

exports.getUsers = function(room, cb) {
    client.hgetall(room, cb);
}

exports.getKeys = function(room, cb) {
    client.hkeys(room,cb);
}



exports.removeUser = function(room,user) {
    client.hdel(room,user,function(error) {
        if(error){
            console.log(error);
        }
    })    
}

exports.removeRoom = function(room) {
    client.del(room, function(error,res) {
        if(error){
            console.log(error);
        }
        else{
            console.log(res);
        }
        //client.end(flush);
    });
}

exports.getAllRomm = function(cb) {
    client.keys('*', cb);
}
exports.getUserCount = function(roomId,cb) {
    client.hlen(roomId, cb);
}