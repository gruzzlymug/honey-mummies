var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
    console.log('a user connected');
});

http.listen(61337, function() {
    console.log('listening on *:61337.');
});
