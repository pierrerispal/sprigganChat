var socket = io(),
    newMessagesCount = 0,
    channel='';
    chatTitle = "Spriggan Chat";

$('#login form').submit(function () {
    if($('#nickname').val().trim()!="" && $('#channel').val().trim()!=""){
        $('#login').css('display','none');
        $('#chat').css('display','block');
        var nickname = $('#nickname').val().trim();
        channel = $('#channel').val().trim();
        $('#channel-title').append('#'+channel);
        var user = {
            nickname:nickname,
            channel:channel
        };
        socket.emit('connect user',user);
    }
    return false;
});

$('#chat form').submit(function(){
    var msg = $('#m').val();
    var send = {
        channel:channel,
        msg:msg.trim()
    };
    
    if(msg.charAt(0)=="!"){
        //then its a command
        socket.emit('command message', send);
    }else{
        //its a message text
        socket.emit('chat message', send);
    }    
    $('#m').val('');
    return false;
});

socket.on('connect user', function(user){
    if(user.channel==channel){
        var msg = user.nickname+' just joined.';
        $('#messages').append($('<li class="connection">').text(msg));
        $('#list #userList').append($('<li class="list-group-item">').html('<span id="'+user.id+'" style="color:'+user.color+'">'+user.nickname+"</span>"));
        scrollChatDown();
    }
});

socket.on('disconnect user', function(user){
    if(user.channel==channel){
        var msg = user.nickname+" just left.";
        $('#messages').append($('<li class="unconnection">').text(msg));
        //@TODO: fix that
        //$('#'+user.id).die();
        scrollChatDown();
    }
});
socket.on('init',function(user){
    if(user.channel==channel){
        $('#list #userList').append($('<li class="list-group-item">').html('<span id="'+user.id+'" style="color:'+user.color+'">'+user.nickname+"</span>"));
    }
});

socket.on('chat message', function(send){
    if(send.channel==channel){
        var msg = '<span style="color:'+send.color+'">'+send.nickname+"</span> : "+send.msg;
        $('#messages').append($('<li>').html(msg));
        //Add 1 to the "lastMessages" and show it in the doc title
        /*newMessagesCount++;
        $(document).prop('title', '('+newMessagesCount+") - "+chatTitle);*/
        scrollChatDown();
    }
});

function clearTitle(){
    newMessagesCount=0;
    $(document).prop('title',chatTitle);
}

function scrollChatDown(){
    var messageHeight = $('#messages').height();
    var lastLiPos = $('#messages li:last-child').position().top;
    if(lastLiPos<=messageHeight){
        $('#messages').scrollTop($('#messages').get(0).scrollHeight);
    }

}