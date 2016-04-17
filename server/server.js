var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var r = require('rethinkdbdash')();

io.on('connection', function(socket) {
    socket.on('select', function(boidID) {
        console.log('boid: ' + boidID);
        io.emit('boid', boidID);
    });
});

http.listen(61337, function() {
  console.log('listening on *:61337.');
});
