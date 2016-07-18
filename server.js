
var IO = require('socket.io');
var db = require('./service/redisdb');
var clientType = '';

exports.run = function (app, server) {
    var io = IO(server);

    io.on('connection', function (socket) {
        clientType = socket.request.headers["user-agent"];
        console.log(clientType);
        var roomId =  socket.request.headers["roomid"]; // 房间
        var currentUser = '';  //当前用户

        //获取roomId
        if (typeof roomId == 'undefined' || roomId == '') {
            try {
                var url = socket.request.headers.referer;
                var urlSplit = url.split('/');
                roomId = urlSplit[urlSplit.length - 1];
            } catch (ex) {
                console.log(ex);
                return false;
            }
        }

        //加入房间
        socket.on('join', function (user) {
            //没有用户名，不做处理，直接退出
            if (!user) {
                return false;
            }

            this.currentUser = user;
            //把当前用户添加到房间中
            db.add(roomId, user, 
                JSON.stringify({ 
                        "username": user,
                        "clientType": clientType 
                })
            );

            socket.join(roomId);

            db.getKeys(roomId, function (error, res) {
                if (error) {
                    console.log(error);
                    return false;
                }
                var result = {
                    user: "系统",
                    message: user+"进入了房间",
                    style: null
                }
                
                io.to(roomId).emit('message', result);
                io.to(roomId).emit('users', res);
                console.log(user + 'join home:' + roomId);
            });
        });

        socket.on('leave', function () {
            socket.emit('disconnect');
        });

        socket.on('disconnect', function () {
            var user = this.currentUser;
            db.getKeys(roomId, function (error, res) {
                if (error) {
                    console.log(error);
                    return false;
                }
                
                if(typeof user == 'undefined') return false;

                if (user.length) {
                    db.removeUser(roomId, user);
                    socket.leave(roomId);
                    var result = {
                        user: "system",
                        message: user+"退出了房间",
                        style: null
                    }
                    io.to(roomId).emit('message', result);
                    io.to(roomId).emit('users', res);
                    console.log(user + 'leave home:' + roomId);
                }
            });
        });

        socket.on('message', function (data) {
            db.getUser(roomId, user = this.currentUser, function (error, res) {
                if (error) {
                    console.log(error);
                    return false;
                }
                //该用户不在房间内
                if (!res) {
                    return false;
                }
                io.to(roomId).emit('message', data);
            });
        });

        socket.on('gift', function (data) {
            db.getUser(roomId, user = this.currentUser, function (error, res) {
                if (error) {
                    console.log(error);
                    return false;
                }
                //该用户不在房间内
                if (!res) {
                    return false;
                }
                var result = {
                    user: "system",
                    message : data.user + "送" + data.gift.name + "：" + data.num,
                    style: null
                }
                io.to(roomId).emit('message', result);
            });
        });

        socket.on('sys', function (data) {
            db.getUser(roomId, user = this.currentUser, function (error, res) {
                if (error) {
                    console.log(error);
                    return false;
                }
                //该用户不在房间内
                if (!res) {
                    return false;
                }
                var result = {
                    user: "system",
                    message: data,
                    style: null
                }
                io.to(roomId).emit('message', result);
            });
        });
    });
}

