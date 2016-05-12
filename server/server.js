//
// nodemon -L server.js
//
// framework
var app = require('express')();
var http = require('http').Server(app);
var parser = require('body-parser');
// services
var os = require('os');
var io = require('socket.io')(http);
var r = require('rethinkdbdash')();

var Promise = require('bluebird')
var unused = Promise.promisifyAll(require('rethinkdbdash')());

var players = [];
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

  })
  .post(function (req, res) {
    // create new player account here
    // var data = {
    //   username: username,
    //   password: password
    // }
    // var query = r.table('authors').insert(data)
    // query.runAsync().then(function (result) {
    //   query = r.table('authors').filter(r.row('username').eq(username))
    //   query.runAsync().then(function (data) {
    //     console.log("NEW " + JSON.stringify(data[0]))
    //     return Promise.resolve(data[0])
    //   })
    // });
  })

app.route('/purge')
  .post(function(req, res) {
    purgePlayers();
    res.json({status: 'OK'})
  });

app.route('/session')
  .get(function(req, res) {
    console.log("get a list of sessions");
    res.json({ message: 'get a list of sessions' });
  })
  .post(function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var sessionID = "default";

    var query = r.table('authors')
      .filter(r.row('username').eq(username))
      .filter(r.row('password').eq(password))
    query.runAsync()
      .then(function(cursor) {
        if (cursor.length > 0 && players.indexOf(username) < 0) {
          console.log("Authenticated " + username);
          players.push(username);
          return Promise.resolve(cursor[0])
        } else {
          // TODO add failed login handler
          console.log("INTRUDER ALERT");
        }
      })
      .then(function (user) {
        // echo login to clients
        // TODO move to after session creation
        io.emit('login', {id: user.id, username: username});

        // create new session
        var data = {
          userID: user.id,
          username: user.name,
          createdAt: new Date()
        }
        var query = r.table('sessions').insert(data)
        return query.runAsync()
      })
      .then(function(result) {
        sessionID = result.generated_keys[0];
        var sessionData = {
          sessionID: sessionID,
          username: username
        }
        return res.json(sessionData)
      })
  })
  .put(function(req, res) {
    console.log("update a session");
    res.json({ message: 'update a session' });
  });

app.route('/session/:id')
  .delete(function(req, res) {
    var sessionID = req.params.id
    console.log("Delete session " + sessionID)
    var query = r.table("sessions").filter(r.row("id").eq(sessionID))
    query.runAsync()
      .then(function(cursor) {
        if (cursor.length > 0) {
          console.log('cursor: ' + JSON.stringify(cursor))
          var session = cursor[0]
          io.emit('logout', {id: session.userID})
        } else {
          // TODO handle no session found
        }
      })
    query.delete().runAsync()
      .then(function (result) {
        // TODO check num deleted == 1
        console.log("  Success");
        res.json({ message: 'signed out'});
      })
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
      console.log("Found Lobby");
      console.log("  Name: " + serverName);
      console.log("  ID:   " + lobbyID);
      currentLobby = lobbyID;
      purgePlayers();
    } else {
      r.table('lobbies').insert({
        server: serverName,
        address: ip,
        created: new Date(),
        players: []
      }).run(function(err, result) {
        if (err) throw err;
        currentLobby = result.generated_keys[0];
        console.log("Lobby ID = " + currentLobby);
      });
    }
  });
});

function handleSignIn(username, password, cursor, err) {
  // TODO move this to Promise land
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
  });
}

function addPlayer() {
}

function purgePlayers() {
  // memory
  players = [];
  // db
  r.table('lobbies').filter(r.row("id").eq(currentLobby))
  .update({players: []})
  .run(function(err, result) {
    if (err) throw err;
    console.log("Purged players");
  });
}
