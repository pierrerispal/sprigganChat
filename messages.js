var readMessage = function(message){
    message = urlify(message);

    return message;
}

function urlify(message){
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
}

exports.readMessage = readMessage;