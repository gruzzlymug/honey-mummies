//
// ███   ████▄ ▄█ ██▄
// █  █  █   █ ██ █  █
// █ ▀ ▄ █   █ ██ █   █
// █  ▄▀ ▀████ ▐█ █  █
// ███          ▐ ███▀
//
Boid.prototype.pos = [];
Boid.prototype.vel = [];
Boid.prototype.dvel = [];
Boid.prototype.hue = [];
Boid.prototype.turns = [];
Boid.prototype.angle = [];
Boid.prototype.neighbors = [];
Boid.prototype.life = [];
Boid.prototype.numBoids = 0;

var angle = 15.0;
Boid.prototype.rotLimit = Math.cos(angle * Math.PI / 180.0);
Boid.prototype.rneg = buildRotationMatrix(-angle);
Boid.prototype.rpos = buildRotationMatrix(angle);

var nearlyZero = 0.0001;
var neighborDist = 50;
var maxNeighbors = 10;

function normalize(v) {
  var lv = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
  if (Math.abs(lv) > nearlyZero) {
    v[0] /= lv;
    v[1] /= lv;
  }
  return v;
}

function dot(v1, v2) {
  return v1[0]*v2[0] + v1[1]*v2[1]
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
  this.selected = false;

  Boid.prototype.pos[this.id] = p;
  Boid.prototype.vel[this.id] = v;
  Boid.prototype.dvel[this.id] = [0, 0];
  Boid.prototype.neighbors[this.id] = [];
  Boid.prototype.turns[this.id] = 0;
  Boid.prototype.life[this.id] = randomInRange(127, 255, true);
}

Boid.prototype.select = function() {
  this.selected = !this.selected;
}

Boid.prototype.align = function() {
  // alignment velocity
  var av = [0, 0];
  var neighbors = Boid.prototype.neighbors[this.id]
  var numNeighbors = neighbors.length;
  for (var i = 0; i < numNeighbors; ++i) {
    var nid = neighbors[i];
    var nv = Boid.prototype.vel[nid];
    av[0] += nv[0];
    av[1] += nv[1];
  }
  av = normalize(av);
  return av;
}

Boid.prototype.separate = function() {
  var neighbors = Boid.prototype.neighbors[this.id]
  var numNeighbors = neighbors.length;
  var av = [0, 0];
  var bp = Boid.prototype.pos[this.id];
  var threshold = 100*100;
  for (var i = 0; i < numNeighbors; ++i) {
    var nid = neighbors[i];
    var np = Boid.prototype.pos[nid];

    var d = [0, 0];
    d[0] = bp[0] - np[0];
    d[1] = bp[1] - np[1];
    var ds = d[0]*d[0] + d[1]*d[1];
    if (ds < threshold) {
      // NOTE add factor to prevent divide by 0
      ds += 0.1;
      var factor = threshold / ds;
      av[0] += d[0] * factor;
      av[1] += d[1] * factor;
    }
  }
  av = normalize(av);

  return av;
}

Boid.prototype.cohere = function() {
  var cv = [0, 0];
  var bp = Boid.prototype.pos[this.id];
  var neighbors = Boid.prototype.neighbors[this.id]
  var numNeighbors = neighbors.length;
  if (numNeighbors > 0) {
    var goal = [0, 0];
    for (var i = 0; i < numNeighbors; ++i) {
      var nid = neighbors[i];
      var np = Boid.prototype.pos[nid];

      goal[0] += (np[0] - bp[0]);
      goal[1] += (np[1] - bp[1]);
    }
    goal[0] /= numNeighbors;
    goal[1] /= numNeighbors;

    cv[0] = goal[0] - Boid.prototype.pos[this.id][0];
    cv[1] = goal[1] - Boid.prototype.pos[this.id][1];
    var cv = normalize(cv);
  }

  return cv;
}

Boid.prototype.gravitate = function() {
  var gv = [0, 0];

  var bp = Boid.prototype.pos[this.id];
  var numSinks = Flock.prototype.sinks.length;
  for (var idxSink = 0; idxSink < numSinks; ++idxSink) {
    sinkPos = Flock.prototype.sinks[idxSink];
    toSink = [0, 0];
    toSink[0] = sinkPos[0] - bp[0];
    toSink[1] = sinkPos[1] - bp[1];
    var threshold = (Flock.prototype.debug ? 20000 : 2000);
    if (toSink[0]*toSink[0] + toSink[1]*toSink[1] < threshold) {
      gv = normalize(toSink);
    }
  }

  return gv;
}

//
// ▄   █ ▄▄  ██▄   ██     ▄▄▄▄▀ ▄███▄
//  █  █   █ █  █  █ █ ▀▀▀ █    █▀   ▀
// █   █ █▀▀▀  █   █ █▄▄█    █    ██▄▄
// █   █ █     █  █  █  █   █     █▄   ▄▀
// █▄ ▄█  █    ███▀     █  ▀      ▀███▀
// ▀▀▀    ▀           █
//                  ▀
//
Boid.prototype.update = function(dt) {
  // velocity modifiers
  var sv = this.separate();
  if (isNaN(sv[0]) || isNaN(sv[1])) {
    var break_here = true;
  }
  var sf = 1;
  var cv = this.cohere();
  if (isNaN(cv[0]) || isNaN(cv[1])) {
    var break_here = true;
  }
  var cf = 1;
  var av = this.align();
  if (isNaN(av[0]) || isNaN(av[1])) {
    var break_here = true;
  }
  var af = 1;
  var gv = this.gravitate();
  if (isNaN(gv[0]) || isNaN(gv[1])) {
    var break_here = true;
  }
  var gf = 1;
  var bv = Boid.prototype.vel[this.id];
  if (isNaN(bv[0]) || isNaN(bv[1])) {
    var break_here = true;
  }

  var vm = [0, 0];
  vm[0] = sf*sv[0] + cf*cv[0] + af*av[0] + gf*gv[0] + bv[0];
  vm[1] = sf*sv[1] + cf*cv[1] + af*av[1] + gf*gv[1] + bv[1];

  if (Flock.prototype.debug) {
    vm[0] = gf*gv[0] + bv[0];
    vm[1] = gf*gv[1] + bv[1];
  }
  vm = normalize(vm);

  Boid.prototype.dvel[this.id][0] = vm[0];
  Boid.prototype.dvel[this.id][1] = vm[1];

  var d = dot(bv, vm);
  var tlim = Boid.prototype.turns[this.id];
  var ts = Math.sign(tlim);
  tlim *= ts;
  if (d < Boid.prototype.rotLimit * 1) { //tlim) {
    // use the determinant to figure out which way vm points
    // this calculation is simplified due to use of the origin
    var determinant = bv[0]*vm[1] - bv[1]*vm[0];
    var side = Math.sign(determinant);
    if (side > 0) {
      if (side == ts) {
        vm = rotate(bv, Boid.prototype.rpos);
        Boid.prototype.turns[this.id] += side;
        Boid.prototype.turns[this.id] = Math.max(side, -4);
      } else {
        Boid.prototype.turns[this.id] = side;
        return;
      }
    } else {
      if (side == ts) {
        vm = rotate(bv, Boid.prototype.rneg);
        Boid.prototype.turns[this.id] += side;
        Boid.prototype.turns[this.id] = Math.min(side, 4);
      } else {
        Boid.prototype.turns[this.id] = side;
        return;
      }
    }
  }
  // never allow velocity to go to zero (prevents 'freeze' glitch)
  if (dot(vm, vm) < nearlyZero) {
    return;
  }
  Boid.prototype.vel[this.id] = vm;
}

Boid.prototype.move = function(context) {
  var lifeForce = Boid.prototype.life[this.id];
  var velocityFactor = 1; // lifeForce / 128.0;
  // lifeForce -= 0.1;
  // Boid.prototype.life[this.id] = Math.max(0, lifeForce);

  Boid.prototype.pos[this.id][0] += (Boid.prototype.vel[this.id][0] * velocityFactor);
  Boid.prototype.pos[this.id][1] += (Boid.prototype.vel[this.id][1] * velocityFactor);

  var width = context.canvas.width - 1;
  var height = context.canvas.height - 1;

  var bx = Boid.prototype.pos[this.id][0];
  if (bx >= width) {
    Boid.prototype.pos[this.id][0] = 0; // bx - width;
  } else if (bx < 0) {
    Boid.prototype.pos[this.id][0] = width; // bx + width;
  }

  var by = Boid.prototype.pos[this.id][1];
  if (by >= height) {
    Boid.prototype.pos[this.id][1] = 0; // by - height;
  } else if (by < 0) {
    Boid.prototype.pos[this.id][1] = height; // by + height;
  }
  // debug
  if (isNaN(Boid.prototype.pos[this.id][0])) {
    var break_here = true;
  }
  if (isNaN(Boid.prototype.pos[this.id][1])) {
    var break_here = true;
  }
}
//
// ██▄   █▄▄▄▄ ██     ▄ ▄
// █  █  █  ▄▀ █ █   █   █
// █   █ █▀▀▌  █▄▄█ █ ▄   █
// █  █  █  █  █  █ █  █  █
// ███▀    █      █  █ █ █
//        ▀      █    ▀ ▀
//              ▀
//
Boid.prototype.draw = function(context) {
  var x = Boid.prototype.pos[this.id][0];
  var y = Boid.prototype.pos[this.id][1];

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

  var depth = 1; //(this.id % 5 + 1) * 0.1 + 0.7

  // draw heading
  if (false) {
    context.strokeStyle = "black"; //"hsla(" + this.hue + ",100%,50%,1)";
    context.beginPath();
    context.moveTo(x, y);
    var vel = Boid.prototype.vel[this.id];
    var dist = 6;
    context.lineWidth = 4;
    context.lineTo(x - vel[0] * dist * depth, y - vel[1] * dist * depth);
    context.stroke();
  }

  // desired velocity
  if (true) {
    context.strokeStyle = "white"; //"hsla(" + 255*255 + ",100%,50%,1)";
    context.beginPath();
    context.moveTo(x, y);
    var vel = Boid.prototype.dvel[this.id];
    var dist = 5;
    context.lineTo(x+vel[0]*dist * depth, y+vel[1]*dist * depth);
    context.stroke();
  }

  // body
  var isSelected = this.selected == true;
  context.beginPath();
  context.arc(x, y, 4*depth, 0, 2*Math.PI, false);
  if (isSelected) {
    context.fillStyle = "red"; // "white"; //"hsla(128,50%,50%,1)";
    context.fill();
    context.moveTo(x + neighborDist, y)
    context.arc(x, y, neighborDist, 0, 2*Math.PI, false);
    context.lineWidth = 0.5;
    context.strokeStyle = 'darkgray';
    context.stroke();
  // } else if (Boid.prototype.neighbors[this.id].includes(selectedID)) {
  //   context.fillStyle = "white"; // "white"; //"hsla(128,50%,50%,1)";
  //   context.fill();
  } else if (true) {
    context.fillStyle = Boid.prototype.hue[this.id];
    context.fillStyle = "cornflowerblue"; // "white"; //"hsla(128,50%,50%,1)";
    context.fill();
  } else {
    context.fillStyle = "hsla(" + this.hue + ",100%,50%,1)";
    context.fill();
  }

  // eye
  context.beginPath();
  var vel = Boid.prototype.dvel[this.id];
  context.arc(x+vel[0]*(dist/2.0), y+vel[1]*(dist/2.0), 1, 0, 2*Math.PI, false);
  if (false) {
    context.fillStyle = "black"; //"hsla(128,50%,50%,1)";
  } else {
    context.fillStyle = "hsla(" + this.hue + ",100%,50%,1)";
  }
  context.fill();
}

//
// ▄████  █    ████▄ ▄█▄    █  █▀
// █▀   ▀ █    █   █ █▀ ▀▄  █▄█
// █▀▀    █    █   █ █   ▀  █▀▄
// █      ███▄ ▀████ █▄  ▄▀ █  █
//  █         ▀      ▀███▀    █
//   ▀                       ▀
//
Flock.prototype.numFlocks = 0;
Flock.prototype.sources = [];
Flock.prototype.sinks = [];
Flock.prototype.numActive = 0;
Flock.prototype.numDesired = 0;
Flock.prototype.boids = [];

function Flock(grid) {
  this.id = Flock.prototype.numFlocks++;
  this.numActive = 0;
  this.numDesired = 0;
  this.boids = [];
  this.sources = [];
  this.sinks = [];
  this.frame = 0;
  Flock.prototype.boids[this.id] = [];

  this.grid = grid;
}

Flock.prototype.createSource = function(x, y) {
  var numSources = Flock.prototype.sources.length;
  Flock.prototype.sources[numSources] = [x, y];
}

Flock.prototype.createSink = function(x, y) {
  var numSinks = Flock.prototype.sinks.length;
  Flock.prototype.sinks[numSinks] = [x, y];
}

Flock.prototype.createBoids = function(numBoids) {
  this.numDesired = numBoids;
}

Flock.prototype.setTarget = function(boid) {
}

Flock.prototype.toggleDebug = function() {
  Flock.prototype.debug = !Flock.prototype.debug;
}

Flock.prototype.selectBoid = function(boidID) {
  this.boids[boidID].select();
}

Flock.prototype.update = function(dt) {
  var numBoids = this.boids.length;
  if (this.frame % 1 == 0) {
    this.numActive = Math.min(numBoids, this.numActive)
    if (this.numActive < this.numDesired) {
      ++this.numActive;
      if (this.numActive > numBoids) {
        this.boids[numBoids] = createBoid();
      } else {
        // reuse existing boid
      }
    }
  }

  if (this.frame % 5 == 0) {
    this.grid.add(Boid.prototype.pos);
    this.grid.findNeighbors(neighborDist, maxNeighbors);

    for (var idxBoid = 0; idxBoid < this.numActive; ++idxBoid) {
      this.boids[idxBoid].update(dt);
    }
  }
  ++this.frame;
}

function createBoid() {
  var numSources = Flock.prototype.sources.length;
  var idxSource = randomInRange(0, numSources - 1, true);
  var src = Flock.prototype.sources[idxSource];
  var p = [src[0], src[1]];
  p[0] += Math.random() * 6 - 3;
  p[1] += Math.random() * 6 - 3;

  // set velocity (aka heading)
  var v = [(Math.random() - 0.5), (Math.random() - 0.5)];
  v = normalize(v);

  var hue = randomInRange(128, 255, 1);
  return new Boid(p, v, hue);
}

Flock.prototype.cull = function() {
  for (var idxBoid = 0; idxBoid < this.numActive; ++idxBoid) {
    if (Boid.prototype.life[idxBoid] < nearlyZero) {
      Boid.prototype.pos[idxBoid] = Boid.prototype.pos[this.numActive - 1];
      Boid.prototype.vel[idxBoid] = Boid.prototype.vel[this.numActive - 1];
      Boid.prototype.life[idxBoid] = Boid.prototype.life[this.numActive - 1];
      --this.numActive;
    }
  }
}

Flock.prototype.move = function(context) {
  var numBoids = this.boids.length;
  for (var idxBoid = 0; idxBoid < numBoids; ++idxBoid) {
    this.boids[idxBoid].move(context);
  }
}

Flock.prototype.draw = function(context) {
  // grid
  context.font = '8pt Futura';
  context.fillStyle = "yellow";

  var mcd = Grid.prototype.minCellDim;
  for (var ix = 0; ix < Grid.prototype.field.length; ++ix) {
      for (var iy = 0; iy < Grid.prototype.field[0].length; ++iy) {
        var xx = ix * mcd + mcd * 0.5;
        var yy = iy * mcd + mcd * 0.5;

        var numBoidsInCell = Grid.prototype.field[ix][iy].length.toString();
        var textDim = context.measureText(numBoidsInCell);
        context.fillText(numBoidsInCell, xx - (textDim.width + 2), yy);
      }
  }

  // boids
  var numBoids = this.numActive;
  for (var idxBoid = 0; idxBoid < numBoids; ++idxBoid) {
    this.boids[idxBoid].draw(context);
  }

  if (Flock.prototype.debug) {
    // sources
    context.fillStyle = "white";
    var numSources = Flock.prototype.sources.length;
    for (var idxSource = 0; idxSource < numSources; ++idxSource) {
      var x = Flock.prototype.sources[idxSource][0];
      var y = Flock.prototype.sources[idxSource][1];
      context.beginPath();
      context.arc(x, y, 6, 0, 2*Math.PI, false);
      context.fill();
    }

    // sinks
    context.fillStyle = "darkslategray";
    var numSinks = Flock.prototype.sinks.length;
    for (var idxSink = 0; idxSink < numSinks; ++idxSink) {
      var x = Flock.prototype.sinks[idxSink][0];
      var y = Flock.prototype.sinks[idxSink][1];
      context.beginPath();
      context.arc(x, y, 6, 0, 2*Math.PI, false);
      context.fill();
    }

    // boid counter
    context.font = '8pt Futura';
    context.fillStyle = "white";
    var boidCounterText = "boids: " + f.numActive;
    context.fillText(boidCounterText, 1, context.canvas.height - 2);
  }
}
