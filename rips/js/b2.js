if (module === undefined) {
  var module = {};
}

module.exports = (function () {
  // --[ BOID ]-----------------------------------------------------------------
  Boid.prototype.numBoids = 0;
  Boid.prototype.pos = [];
  Boid.prototype.vel = [];
  Boid.prototype.neighbors = [];
  Boid.prototype.centroid = [];

  function Boid(pos, vel) {
    this.id = Boid.prototype.numBoids++;
    Boid.prototype.pos[this.id] = pos;
    Boid.prototype.vel[this.id] = vel;
    Boid.prototype.neighbors[this.id] = [];
  }

  Boid.prototype.constructor = Boid

  Boid.prototype.separate = function () {
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

  Boid.prototype.cohere = function () {
    var cv = [0, 0];
    if (Boid.prototype.neighbors[this.id].length === 0) {
      return cv;
    }

    goal = Boid.prototype.centroid[this.id];
    var bp = Boid.prototype.pos[this.id];
    cv[0] = goal[0] - bp[0];
    cv[1] = goal[1] - bp[1];
    return cv;
  }

  function clamper() {

  }

  Boid.prototype.update = function (dt) {
    // velocity modifiers
    var sv = this.separate();
    var sf = 0.0;

    var cv = this.cohere();
    // let dist2 = dot(cv, cv);
    // if (dist2 < 4 || dist2 > 120) {
    //   cv = [0, 0];
    // }
    var cf = 0.0;

    //----
    let bvc = 0.99999999;
    var bv = Boid.prototype.vel[this.id];

    var vm = [0, 0];
    vm[0] = sf*sv[0] + cf*cv[0] + bvc*bv[0];
    vm[1] = sf*sv[1] + cf*cv[1] + bvc*bv[1];

    let vl = Math.sqrt(dot(vm, vm));
    if (vl > 4) {
      vm = normalize(vm);
      vm[0] *= 4;
      vm[1] *= 4;
    }

    Boid.prototype.vel[this.id] = vm;
  }

  Boid.prototype.move = function (dt) {
    let vc = 1;
    Boid.prototype.pos[this.id][0] += (vc * Boid.prototype.vel[this.id][0]);
    Boid.prototype.pos[this.id][1] += (vc * Boid.prototype.vel[this.id][1]);

    // keep boid within limits
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
  }

  Boid.prototype.draw = function (context) {
    this.ctx = context;

    var x = Boid.prototype.pos[this.id][0];
    var y = Boid.prototype.pos[this.id][1];

    context.beginPath();
    context.fillStyle = "blue";
    if (this.id != 0) {
      context.fillStyle = "yellow";
    }
    context.arc(x, y, 4, 0, 2*Math.PI, false);
    context.fill();
  }

  function sayIt() {
    console.log("HEEBEE JEEBEE");
  }

  Boid.prototype.blah = function () {
    sayIt();
  }

  //--[ FLOCK ]-----------------------------------------------------------------
  Flock.prototype.sources = [];

  function Flock(grid) {
    this.grid = grid;
    this.numActive = 0;
    this.boids = [];
    this.neighborDist = 75;
    this.maxNeighbors = 10;
  }

  Flock.prototype.constructor = Flock

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

    return new Boid(p, v);
  }

  Flock.prototype.createSource = function (x, y) {
    let nextSourceIdx = Flock.prototype.sources.length;
    Flock.prototype.sources[nextSourceIdx] = [x, y];
  }

  Flock.prototype.createBoids = function (numBoids) {
    this.numDesired = numBoids;
  }

  Flock.prototype.spawn = function (dt) {
    var numBoids = this.boids.length;
    this.numActive = Math.min(numBoids, this.numActive);
    if (this.numActive < this.numDesired) {
      ++this.numActive;
      if (this.numActive > numBoids) {
        this.boids[numBoids] = createBoid();
      }
    }
  }

  Flock.prototype.update = function (dt) {
    for (let idxBoid = 0; idxBoid < this.numActive; ++idxBoid) {
      this.boids[idxBoid].update(dt);
      this.boids[idxBoid].move(dt);
    }

    this.grid.add(Boid.prototype.pos);
    this.grid.findNeighbors(this.neighborDist, this.maxNeighbors);

    for (let idxBoid = 0; idxBoid < this.numActive; ++idxBoid) {
      Boid.prototype.centroid[idxBoid] = findGroupCentroid(idxBoid);
    }
  }

  function findGroupCentroid(boidId) {
    var neighbors = Boid.prototype.neighbors[boidId]
    var numNeighbors = neighbors.length;
    var bp = Boid.prototype.pos[boidId];
    var goal = [bp[0], bp[1]];
    for (var i = 0; i < numNeighbors; ++i) {
      var nid = neighbors[i];
      var np = Boid.prototype.pos[nid];

      goal[0] += np[0];
      goal[1] += np[1];
    }
    goal[0] /= numNeighbors+1;
    goal[1] /= numNeighbors+1;

    return goal;
  }

  Flock.prototype.debugDraw = function (context) {
    let numBoids = this.boids.length;
    let specialBoidId = 0;
    let skipRegularBoids = true;

    for (let idxBoid = 0; idxBoid < numBoids; ++idxBoid) {
      if (skipRegularBoids && idxBoid != specialBoidId) {
        continue;
      }

      var bp = Boid.prototype.pos[idxBoid];

      // draw neighborDist range
      drawCircle(bp[0], bp[1], this.neighborDist, 'darkgray', 0.5);

      var neighbors = Boid.prototype.neighbors[idxBoid];
      var numNeighbors = neighbors.length;
      if (numNeighbors > 0) {
        context.strokeStyle = "red"; //"hsla(" + this.hue + ",100%,50%,1)";
        context.lineWidth = 0.5;
        context.beginPath();
        let pos = Boid.prototype.centroid[idxBoid];
        for (var i = 0; i < numNeighbors; ++i) {
          context.moveTo(pos[0], pos[1]);
          var nid = neighbors[i];
          var np = Boid.prototype.pos[nid];
          context.lineTo(np[0], np[1]);
          context.stroke();
        }

        context.moveTo(pos[0], pos[1]);
        context.lineTo(bp[0], bp[1]);
        context.stroke();

        xyz(context, pos[0], pos[1], 2, "white");
      }
    }
  }

  function drawCircle(x, y, radius, color, width) {
    context.moveTo(x + radius, y)
    context.arc(x, y, radius, 0, 2*Math.PI, false);
    context.lineWidth = width;
    context.strokeStyle = color;
    context.stroke();
  }

  function xyz(context, x, y, radius, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, radius, 0, 2*Math.PI, false);
    context.fill();
  }

  Flock.prototype.draw = function(context) {
    var numBoids = this.boids.length;
    for (var idxBoid = 0; idxBoid < numBoids; ++idxBoid) {
      this.boids[idxBoid].draw(context);
    }
  }

  return {
    Boid,
    Flock
  };
})();
