//Setup basic express server
var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io')(server),
    port = process.env.PORT || 3000,
    reader = require('./messages'),
    userList = [];
//Run the server
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
    console.log("new connection");

    socket.on('connect user', function(user){
        if(user.nickname!="" && user.nickname!=""){
            //@TODO: check that the nickname isnt already in use
            console.log(user.nickname+" just joined the channel #"+user.channel);
            //Need to add options here
            //like random color, role and stuff
            user['color']='red';
            user['id']=socket.id;
            
            socket.user = user;
            userList.push(socket);
            socket.broadcast.emit('connect user',user);
            init(socket);
        }
    });

    socket.on('disconnect', function () {  
        io.emit('disconnect user',socket.user);
        //if user is connected
        if(socket.user!=null){
            console.log(socket.user.nickname+" just left");
            var i = userList.indexOf(socket);
            userList.splice(i,1);
        }
    });

    socket.on('chat message', function(send){
        //socket.broadcast.to(socketid).emit('message', 'for your eyes only');
        
        if(socket.user==null){
            socket.emit('refresh user');
        }
        if(send.msg!=""){
            send.msg = reader.readMessage(send.msg);
            send.nickname = socket.user.nickname;
            console.log("["+send.channel+"] "
                +send.nickname
                +" : "+send.msg);
            io.emit('chat message', send);
        }
    });
    socket.on('command message',function(send){
        
    })
});

function init(socket){
    userList.forEach(function (e,i,a) {
        socket.emit('init', e.user);
    });
}