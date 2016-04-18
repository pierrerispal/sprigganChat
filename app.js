//Setup basic express server
var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io')(server),
    port = process.env.PORT || 3000,

    //Setup modules and specifics variable
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
            console.log(user.nickname+" just joined the channel #"+user.channel);
            //need to add the user parameters right here
            user['id']=socket.id;
            //@TODO: give a random color
            user['color']='red';
            
            socket.user = user;
            sendAllUsers(socket);
            userList.push(socket);
            io.emit('connect user',socket.user);
        }
    });

    socket.on('disconnect', function () {
        console.log("someone just left");
        //if user is connected
        if(socket.user!=null){
            var i = userList.indexOf(socket);
            userList.splice(i,1);
            io.emit('disconnect user',socket.user);
        }
    });

    socket.on('chat message', function(send){
        if(socket.user==null){
            socket.emit('refresh user');
        }
        if(send.msg!=""){
            send.msg = reader.readMessage(send.msg);
            send.nickname = socket.user.nickname;
            send['color']=socket.user.color;
            console.log("["+send.channel+"] "
                +send.nickname
                +" : "+send.msg);
            io.emit('chat message', send);
        }
    });
});

function sendAllUsers(socket){
    userList.forEach(function (e,i,a) {
        socket.emit('init', e.user);
    });
}