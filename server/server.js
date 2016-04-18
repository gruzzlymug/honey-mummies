var bodyParser = require('body-parser');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var r = require('rethinkdbdash')();

app.use(bodyParser.json());

app.route('/session')
  .get(function(req, res) {
    console.log("get a session");
    res.json({ message: 'get a session' });
  })
  .post(function(req, res) {
    console.log("add a session");
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;

    r.table('authors')
    .filter(r.row('username').eq(username))
    .run(function(err, cursor) {
      if (cursor.length == 0) {
        console.log("Adding " + username);
        r.table('authors').insert({
          username: username,
          password: password
        }).run();
      } else {
        console.log("Found " + username);
        if (cursor[0].password == password) {
          console.log("Authenticated");
          // sessionStorage.setItem('username', username);
          io.emit('login', username);
        } else {
          console.log("INTRUDER ALERT");
        }
      }
    });

    res.json({
      message: 'add a session',
      username: username,
    });
  })
  .put(function(req, res) {
    console.log("update a session");
    res.json({ message: 'update a session' });
  });

io.on('connection', function(socket) {
  socket.on('select', function(boidID) {
    console.log('boid: ' + boidID);
    io.emit('boid', boidID);
  });
});

http.listen(61337, function() {
  console.log('listening on *:61337.');
});
