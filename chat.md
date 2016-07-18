# 聊天服务

## socket.io 参考网址
[官网](http://socket.io)
[ios](http://socket.io/blog/socket-io-on-ios/)
[android](http://socket.io/blog/native-socket-io-and-android/)


## 地址
```
address = 'http://124.42.118.114:3000/'
```


## 安装
##### js
    拷贝socete.io.js文件到项目中

##### ios 
    提供了swift版本:
[socket.io-client-swift](https://github.com/socketio/socket.io-client-swift) 

##### android  
    build.gradle依赖: compile 'com.github.nkzawa:socket.io-client:0.3.0'
    AndroidManifest.xml权限：android.permission.INTERNET

## 创建

##### js
```
var socket;

if (/Firefox\/\s/.test(navigator.userAgent)){
    socket = io.connect(address,{transports:['xhr-polling']});
}
else if (/MSIE (\d+.\d+);/.test(navigator.userAgent)){
    socket = io.connect(address,{transports:['jsonp-polling']});
}else{
    socket = io.connect(address);
}
```

##### ios
```
let socket = SocketIOClient(socketURL: address)
```
##### android
```
Socket socket = IO.socket(address);    
```

## 连接
##### js
`
socket.on('connect', function () {
    socket.emit('join',user);
});
`

## 消息
##### 消息格式
`
var data = {
        user： string,
        message: string,
        style:object //默认为null
    }
`
##### 接收 js
socket.on('message',function(data){
    //此处写消息返回的回调方法
});

##### 发送 js
`
socket.emit('message',data)
`

## 在线用户
    客户端需事先在线用户监听方法，有新用户加入时候，更新用户列表

##### js
socket.on('users', function(users){
    //users为最新的用户列表，数据结构为['aa','bb','cc'....]
    //此处写更新的用户列表信息
});


## 送礼物
##### 数据格式
`
var data = {
    user: string, //送礼物的用户
    anchor: string, //主播
    gift:{
        id: int, //礼物编号
        name: string //礼物名称
        type: int    //类型，主要目的是区别是否广播，默认0，只在本房间广播，1，所有房间广播
    }，
    num: int //数量
}
`
##### js
`
socket.emit('gift',data);
`
## 发送系统消息
    需要客户端发送系统消息的时候可以调用该方法，一般来说系统消息又服务端发送，该方法会隐含在“加入”、“离开”、“消息”和“礼物”中，不需要单独调用。
`
socket.emit('sys',data); //data 为字符串
`

## 退出
`
socket.emit('leave');
`