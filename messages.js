var readMessage = function(message){
    message = urlify(message);
    message = smileyify(message);
    return message;
}

function urlify(message){
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
}
function smileyify(message){
    var smileySpriggan = ':spriggan';
    return message.replace(smileySpriggan,'<img src="/img/spriggan.png" />');
}

exports.readMessage = readMessage;