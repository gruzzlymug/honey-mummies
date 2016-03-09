Boid.prototype.pos = [];
Boid.prototype.vel = [];
Boid.prototype.angle = [];
Boid.prototype.neighbors = [];
Boid.prototype.numBoids = 0;

function Boid(p, v, hue) {
  this.id = Boid.prototype.numBoids++;
  this.hue = hue;
  Boid.prototype.pos[this.id] = p;
  Boid.prototype.vel[this.id] = v;
}

Boid.prototype.align = function() {
  // alignment velocity
  var neighbors = Boid.prototype.neighbors[this.id]
  var av = [0, 0];
  var numNeighbors = neighbors.length;
  for (var i = 0; i < numNeighbors; ++i) {
    var nid = neighbors[i];
    var nv = Boid.prototype.vel[nid];
    av[0] += nv[0];
    av[1] += nv[1];
  }
  var lv = Math.sqrt(av[0]*av[0] + av[1]*av[1]);
  av[0] /= lv;
  av[1] /= lv;

  var vel = Boid.prototype.vel[this.id];
  vel[0] += av[0] / 3.0;
  vel[1] += av[1] / 3.0;

  var lvel = Math.sqrt(vel[0]*vel[0] + vel[1]*vel[1]);
  vel[0] /= lvel;
  vel[1] /= lvel;

  return vel;
}

Boid.prototype.cohere = function() {
  var neighbors = Boid.prototype.neighbors[this.id]
  var goal = [0, 0];
  var numNeighbors = neighbors.length;
  for (var i = 0; i < numNeighbors; ++i) {
    var nid = neighbors[i];
    var np = Boid.prototype.pos[nid];

    goal[0] += np[0];
    goal[1] += np[1];
  }
  goal[0] /= numNeighbors;
  goal[1] /= numNeighbors;

  var cv = [0, 0];
  cv[0] = goal[0] - Boid.prototype.pos[this.id][0];
  cv[1] = goal[1] - Boid.prototype.pos[this.id][1];

  // cohesion velocity length
  var cvl = Math.sqrt(cv[0]*cv[0] + cv[1]*cv[1]);
  var factor = 1;
  if (cvl < 25) {
    factor = -1;
  }

  cv[0] /= cvl * factor;
  cv[1] /= cvl * factor;

  return cv;
}

Boid.prototype.update = function(dt) {
  // velocity modifier
  var cv = this.cohere();
  var av = this.align();
  var bv = Boid.prototype.vel[this.id];
  var vm = [0, 0];
  vm[0] = cv[0] + av[0] + bv[0];
  vm[1] = cv[1] + av[1] + bv[1];
  var lvm = Math.sqrt(vm[0]*vm[0] + vm[1]*vm[1]);
  vm[0] /= lvm;
  vm[1] /= lvm;

  Boid.prototype.vel[this.id] = vm;

  // update position
  Boid.prototype.pos[this.id][0] += Boid.prototype.vel[this.id][0];
  Boid.prototype.pos[this.id][1] += Boid.prototype.vel[this.id][1];

  var bx = Boid.prototype.pos[this.id][0];
  if (bx > 495) {
    Boid.prototype.pos[this.id][0] = bx - 490;
  } else if (bx < 5) {
    Boid.prototype.pos[this.id][0] = bx + 490;
  }

  var by = Boid.prototype.pos[this.id][1];
  if (by > 495) {
    Boid.prototype.pos[this.id][1] = by - 490;
  } else if (by < 5) {
    Boid.prototype.pos[this.id][1] = by + 490;
  }
}

Boid.prototype.draw = function(context) {
  var x = Boid.prototype.pos[this.id][0];
  var y = Boid.prototype.pos[this.id][1];

  ok = false; //(this.id == 14);

  context.beginPath();
  context.arc(x, y, 5, 0, 2*Math.PI, false);
  if (ok) {
    context.fillStyle = "hsla(128,50%,50%,1)";
  } else {
    context.fillStyle = "hsla(" + this.hue + ",100%,50%,1)";
  }
  context.fill();

  if (ok) {
    for (var ni = 0; ni < Boid.prototype.neighbors[this.id].length; ++ni) {
      var nid = Boid.prototype.neighbors[this.id][ni];
      var nx = Boid.prototype.pos[nid][0];
      var ny = Boid.prototype.pos[nid][1];
      context.beginPath();
      context.arc(nx, ny, 6, 0, 2*Math.PI, false);
      context.fillStyle = "#000000";
      context.stroke();
    }
  }

  context.font = '6pt Courier';
  context.fillStyle = "#000000";
  context.fillText(this.id, x-5, y-5);
}

function Flock() {
}

Flock.prototype.setTarget = function(boid) {
}

function projector(i, id, ps, nns, nn) {
  var ll = i - nn;
  ll = ll >= 0 ? ll : 0;
  var ul = i + nn;
  ul = ul < numBoids ? ul : numBoids;
  for (var n = ll; n < ul; ++n) {
    pid = ps[n] % 1000;
    if (pid == id) continue;
    nns.push(pid);
  }
}

Flock.prototype.findNeighbors = function() {
  var numBoids = Boid.prototype.numBoids;
  var p = Boid.prototype.pos;
  var xs = [];
  var ys = [];
  var xnn = []
  var ynn = []
  for (var i = 0; i < numBoids; ++i) {
    xs[i] = Math.round(p[i][0]) * 1000 + i;
    ys[i] = Math.round(p[i][1]) * 1000 + i;
    xnn[i] = [];
    ynn[i] = [];
  }
  xs = xs.sort(function(a,b){return a-b});
  ys = ys.sort(function(a,b){return a-b});

  for (var i = 0; i < numBoids; ++i) {
    var xid = xs[i] % 1000;
    projector(i, xid, xs, xnn[xid], 4);
    var yid = ys[i] % 1000;
    projector(i, yid, ys, ynn[yid], 4);
  }

  for (var i = 0; i < numBoids; ++i) {
    // NOTE the all array can have dups
    var all = xnn[i].concat(ynn[i]);
    var boid = Boid.prototype.pos[i];
    var closest = {};
    for (a = 0; a < all.length; ++a) {
      var neighbor = Boid.prototype.pos[all[a]];
      var dx = boid[0] - neighbor[0];
      var dy = boid[1] - neighbor[1];
      dist = dx*dx + dy*dy;
      closest[dist] = all[a];
    }
    var c4k = Object.keys(closest).sort(function(a,b){return a-b});
    var c4n = [];
    // want 4 neighbors, but could have fewer in rare cases
    var numNeigbors = Math.min(4, c4k.length);
    for (var ni = 0; ni < numNeigbors; ++ni) {
      var neighborId = closest[c4k[ni]];
      c4n.push(neighborId);
    }
    Boid.prototype.neighbors[i] = c4n;
  }
}

Flock.prototype.update = function(dt) {
  this.findNeighbors();
}

Flock.prototype.draw = function(context) {
}
