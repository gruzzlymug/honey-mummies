var Boid = require('./Boid.js');

module.exports = (function () {
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
      drawCircle(context, bp[0], bp[1], this.neighborDist, 'darkgray', 0.5);

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

  function drawCircle(context, x, y, radius, color, width) {
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

  return Flock;
})();
