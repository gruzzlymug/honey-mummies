Boid.prototype.pos = [];
Boid.prototype.vel = [];
Boid.prototype.turns = [];
Boid.prototype.angle = [];
Boid.prototype.neighbors = [];
Boid.prototype.numBoids = 0;

var angle = 5.0;
Boid.prototype.rotLimit = Math.cos(angle * Math.PI / 180.0);
Boid.prototype.rneg = buildRotationMatrix(-angle);
Boid.prototype.rpos = buildRotationMatrix(angle);

function normalize(v) {
  var lv = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
  if (Math.abs(lv) > 0.0001) {
    v[0] /= lv;
    v[1] /= lv;
  }
  return v;
}

function dot(v1, v2) {
  return v1[0]*v2[0] + v1[0]*v2[1]
}

function buildRotationMatrix(degrees) {
  var radians = degrees * Math.PI / 180.0;
  var matrix = [
    [Math.cos(radians), -Math.sin(radians)],
    [Math.sin(radians), Math.cos(radians)],
  ];
  return matrix;
}

function rotate(v, m) {
  var x = m[0][0]*v[0] + m[0][1]*v[1]
  var y = m[1][0]*v[0] + m[1][1]*v[1]
  return [x, y];
}

function Boid(p, v, hue) {
  this.id = Boid.prototype.numBoids++;
  this.hue = hue;
  Boid.prototype.pos[this.id] = p;
  Boid.prototype.vel[this.id] = v;
  Boid.prototype.turns[this.id] = 0;
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
  av = normalize(av);

  var vel = Boid.prototype.vel[this.id];
  vel[0] += av[0] / 3.0;
  vel[1] += av[1] / 3.0;
  vel = normalize(vel);

  return vel;
}

Boid.prototype.separate = function() {
  var neighbors = Boid.prototype.neighbors[this.id]
  var numNeighbors = neighbors.length;
  var av = [0, 0];
  var bp = Boid.prototype.pos[this.id];
  var threshold = 25*25;
  for (var i = 0; i < numNeighbors; ++i) {
    var nid = neighbors[i];
    var np = Boid.prototype.pos[nid];

    var d = [0, 0];
    d[0] = bp[0] - np[0];
    d[1] = bp[1] - np[1];
    var ds = d[0]*d[0] + d[1]*d[1];
    if (ds < threshold) {
      d = normalize(d);
      var factor = threshold / ds;
      av[0] += d[0] * factor;
      av[1] += d[1] * factor;
    }
  }
  av = normalize(av);

  return av;
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
  var cv = normalize(cv);

  return cv;
}

Boid.prototype.update = function(dt) {
  // velocity modifiers
  var sv = this.separate();
  var cv = this.cohere();
  var av = this.align();
  var bv = Boid.prototype.vel[this.id];
  var vm = [0, 0];
  vm[0] = sv[0] + cv[0] + av[0] + bv[0];
  vm[1] = sv[1] + cv[1] + av[1] + bv[1];

  vm = normalize(vm);
  var d = dot(bv, vm);
  var tlim = Boid.prototype.turns[this.id];
  var ts = Math.sign(tlim);
  tlim *= ts;
  if (d < Boid.prototype.rotLimit * tlim) {
    // use the determinant to figure out which way vm points
    // this calculation is simplified due to use of the origin
    var determinant = bv[0]*vm[1] - bv[1]*vm[0];
    var side = Math.sign(determinant);
    if (side < 0) {
      if (side == ts) {
        vm = rotate(vm, Boid.prototype.rpos);
        Boid.prototype.turns[this.id] += side;
        Boid.prototype.turns[this.id] = Math.max(side, -4);
      } else {
        Boid.prototype.turns[this.id] = side;
      }
    } else {
      if (side == ts) {
        vm = rotate(vm, Boid.prototype.rneg);
        Boid.prototype.turns[this.id] += side;
        Boid.prototype.turns[this.id] = Math.min(side, 4);
      } else {
        Boid.prototype.turns[this.id] = side;
      }
    }
  }
  Boid.prototype.vel[this.id] = vm;
}

Boid.prototype.move = function(context) {
  Boid.prototype.pos[this.id][0] += Boid.prototype.vel[this.id][0];
  Boid.prototype.pos[this.id][1] += Boid.prototype.vel[this.id][1];

  var width = context.canvas.width - 0;
  var height = context.canvas.height - 0;

  var bx = Boid.prototype.pos[this.id][0];
  if (bx > width) {
    Boid.prototype.pos[this.id][0] = bx - width;
  } else if (bx < 0) {
    Boid.prototype.pos[this.id][0] = bx + width;
  }

  var by = Boid.prototype.pos[this.id][1];
  if (by > height) {
    Boid.prototype.pos[this.id][1] = by - height;
  } else if (by < 0) {
    Boid.prototype.pos[this.id][1] = by + height;
  }
}

Boid.prototype.draw = function(context) {
  var x = Boid.prototype.pos[this.id][0];
  var y = Boid.prototype.pos[this.id][1];

  context.beginPath();
  context.arc(x, y, 2, 0, 2*Math.PI, false);
  if (false) {
    context.fillStyle = "hsla(128,50%,50%,1)";
  } else {
    context.fillStyle = "hsla(" + this.hue + ",100%,50%,1)";
  }
  context.fill();

  if (false) {
    for (var ni = 0; ni < Boid.prototype.neighbors[this.id].length; ++ni) {
      var nid = Boid.prototype.neighbors[this.id][ni];
      var nx = Boid.prototype.pos[nid][0];
      var ny = Boid.prototype.pos[nid][1];
      context.beginPath();
      context.arc(nx, ny, 2, 0, 2*Math.PI, false);
      context.fillStyle = "#000000";
      context.stroke();
    }
  }

  if (true) {
    context.strokeStyle = "hsla(" + this.hue + ",100%,50%,1)";
    context.beginPath();
    context.moveTo(x, y);
    var vel = Boid.prototype.vel[this.id];
    var dist = 4;
    context.lineTo(x+vel[0]*dist, y+vel[1]*dist);
    context.stroke();
  }
}

function Flock() {
}

Flock.prototype.setTarget = function(boid) {
}

// TODO break on NaNs in ps (esp when limiting neighbors by distance)
function projector(i, id, ps, nns, nn) {
  var ll = Math.max(i - nn, 0);
  var ul = Math.min(i + nn, numBoids);
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
      // check distance to neighbor
      var bp = Boid.prototype.pos[i];
      var np = Boid.prototype.pos[neighborId];
      var dx = bp[0] - np[0];
      var dy = bp[1] - np[1];
      // TODO limit neighbors to range
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
