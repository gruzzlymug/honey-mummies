// framework
var app = require('express')();
var http = require('http').Server(app);
var parser = require('body-parser');
// services
var os = require('os');
var io = require('socket.io')(http);
var r = require('rethinkdbdash')();

var currentLobby = null;

app.use(parser.json());

app.route('/lobby')
  .get(function(req, res) {
    var lobbies = [];
    r.table('lobbies')
    .run(function(err, cursor) {
      if (err) throw err;
      if (cursor.length > 0) {
        console.log("GET lobby");
        lobbies = cursor;
        res.json(lobbies);
      }
    });
  });

app.route('/lobby/:id')
  .get(function(req, res) {
    var id = req.params.id;
    var lobby = {};
    r.table('lobbies').filter(r.row("id").eq(id))
    .run(function(err, cursor) {
      if (err) throw err;
      if (cursor.length > 0) {
        lobby = cursor[0];
        console.log("used ID");
        res.json(lobby);
      }
    });
  });

app.route('/player')
  .get(function(req, res) {

  });

app.route('/session')
  .get(function(req, res) {
    console.log("get a session");
    res.json({ message: 'get a session' });
  })
  .post(function(req, res) {
    // console.log("add a session");
    // console.log(req.body);
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
        // console.log("Found " + username);
        if (cursor[0].password == password) {
          console.log("Authenticated " + username);
          // sessionStorage.setItem('username', username);
          io.emit('login', {id: cursor[0].id, username: username});
          if (currentLobby) {
            // NOTE no db?
            r.table('lobbies').filter(r.row("id").eq(currentLobby))
            .update({players: r.row("players")
              .append({
                id: cursor[0].id,
                username: username
              })
            })
            .run(function(err, result) {
              if (err) throw err;
              console.log("Added " + username + " to lobby");
              // console.log(JSON.stringify(result, null, 2));
            });
          }
        } else {
          console.log("INTRUDER ALERT");
        }
      }
    });

    res.json({
      lobby: currentLobby,
      username: username,
    });
  })
  .put(function(req, res) {
    console.log("update a session");
    res.json({ message: 'update a session' });
  })
  .delete(function(req, res) {
    console.log("delete a session");
    res.json({ message: 'signed out'});
  });

io.on('connection', function(socket) {
  socket.on('select', function(boidID) {
    console.log('boid: ' + boidID);
    io.emit('boid', boidID);
  });
});

http.listen(61337, function() {
  console.log('listening on *:61337.');
  // http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
  var ip = os.networkInterfaces()['eth0'][0]['address'];
  var serverName = "hms-" + ip.toString();
  r.table('lobbies').filter(r.row("server").eq(serverName))
  .run(function(err, cursor) {
    if (err) throw err;
    if (cursor.length > 0) {
      var lobbyID = cursor[0].id;
      console.log("Found Lobby: " + serverName + " (" + lobbyID + ")");
      currentLobby = lobbyID;
    } else {
      r.table('lobbies').insert({
        server: serverName,
        address: ip,
        created: 'DATE',
        players: []
      }).run(function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
        currentLobby = result.generated_keys[0];
        console.log("Lobby ID = " + currentLobby);
      });
    }
    // clear out any existing players
    r.table('lobbies').filter(r.row("id").eq(currentLobby))
    .update({players: []})
    .run(function(err, result) {
      if (err) throw err;
      // console.log("->" + JSON.stringify(result, null, 2));
      console.log("Purged players");
      // console.log("# players: " + lobby.players)
    });
  });
});
