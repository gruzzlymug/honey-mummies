require('./smu.orig.js');
import { drawCircle } from './draw2d.js';
import BoidFunction from './Boid.js';
import * as StdBoid from './boid_std'

const Boid = BoidFunction();

export default function () {
  Flock.prototype.numFlocks = 0;
  Flock.prototype.numBoids = 0;
  Flock.prototype.pos = [];
  Flock.prototype.vel = [];
  Flock.prototype.neighbors = [];
  Flock.prototype.centroid = [];

  Flock.prototype.sources = [];

  function Flock(grid) {
    this.id = Flock.prototype.numFlocks++;
    this.grid = grid;
    this.numActive = 0;
    this.boids = [];
    this.neighborDist = 75;
    this.maxNeighbors = 10;
  }

  Flock.prototype.constructor = Flock

  Flock.prototype.createBoid = function() {
    var numSources = Flock.prototype.sources.length;
    var idxSource = randomInRange(0, numSources - 1, true);
    var src = Flock.prototype.sources[idxSource];
    var p = [src[0], src[1]];
    p[0] += Math.random() * 6 - 3;
    p[1] += Math.random() * 6 - 3;

    // set velocity (aka heading)
    var v = [(Math.random() - 0.5), (Math.random() - 0.5)];
    v = normalize(v);

    let boidId = Flock.prototype.numBoids++;
    Flock.prototype.pos[boidId] = p;
    Flock.prototype.vel[boidId] = v;
    Flock.prototype.neighbors[boidId] = [];

    return boidId;
  }

  Flock.prototype.moveBoid = function (dt, boidId) {
    let vc = 1;
    Flock.prototype.pos[boidId][0] += (vc * Flock.prototype.vel[boidId][0]);
    Flock.prototype.pos[boidId][1] += (vc * Flock.prototype.vel[boidId][1]);

    // keep boid within limits
    var width = 200; //context.canvas.width - 1;
    var height = 200; //context.canvas.height - 1;

    var bx = Flock.prototype.pos[boidId][0];
    if (bx >= width) {
      Flock.prototype.pos[boidId][0] = 0; // bx - width;
    } else if (bx < 0) {
      Flock.prototype.pos[boidId][0] = width; // bx + width;
    }

    var by = Flock.prototype.pos[boidId][1];
    if (by >= height) {
      Flock.prototype.pos[boidId][1] = 0; // by - height;
    } else if (by < 0) {
      Flock.prototype.pos[boidId][1] = height; // by + height;
    }
  }

  Flock.prototype.drawBoid = function (context, boidId) {
    var x = Flock.prototype.pos[boidId][0];
    var y = Flock.prototype.pos[boidId][1];

    let radius = 4;
    // drawDot(context, x, y, radius, "white")
    drawCircle(context, x, y, radius, "red", 0.5);
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
        this.boids[numBoids] = Flock.prototype.createBoid();
      }
    }
  }

  Flock.prototype.update = function (dt) {
    for (let idxBoid = 0; idxBoid < this.numActive; ++idxBoid) {
      // this.boids[idxBoid].update(dt);
      let neighbors = Flock.prototype.neighbors[idxBoid];
      let v = StdBoid.update(dt, idxBoid, neighbors, Flock.prototype.pos);
      Flock.prototype.vel[idxBoid] = v;
      // StdBoid.separate(idxBoid, Flock.prototype.neighbors[idxBoid], Flock.prototype.pos);

      // this.boids[idxBoid].move(dt);
      Flock.prototype.moveBoid(dt, idxBoid);
    }

    this.grid.add(Flock.prototype.pos);
    this.grid.findNeighbors(this.neighborDist, this.maxNeighbors, Flock.prototype);

    for (let idxBoid = 0; idxBoid < this.numActive; ++idxBoid) {
      Flock.prototype.centroid[idxBoid] = findGroupCentroid(idxBoid);
    }
  }

  function findGroupCentroid(boidId) {
    var neighbors = Flock.prototype.neighbors[boidId]
    var numNeighbors = neighbors.length;
    var bp = Flock.prototype.pos[boidId];
    var goal = [bp[0], bp[1]];
    for (var i = 0; i < numNeighbors; ++i) {
      var nid = neighbors[i];
      var np = Flock.prototype.pos[nid];

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

      var bp = Flock.prototype.pos[idxBoid];

      // draw neighborDist range
      drawCircle(context, bp[0], bp[1], this.neighborDist, 'darkgray', 0.5);

      var neighbors = Flock.prototype.neighbors[idxBoid];
      var numNeighbors = neighbors.length;
      if (numNeighbors > 0) {
        context.strokeStyle = "red"; //"hsla(" + this.hue + ",100%,50%,1)";
        context.lineWidth = 0.5;
        context.beginPath();
        let pos = Flock.prototype.centroid[idxBoid];
        for (var i = 0; i < numNeighbors; ++i) {
          context.moveTo(pos[0], pos[1]);
          var nid = neighbors[i];
          var np = Flock.prototype.pos[nid];
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

  function xyz(context, x, y, radius, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, radius, 0, 2*Math.PI, false);
    context.fill();
  }

  Flock.prototype.draw = function(context) {
    var numBoids = this.boids.length;
    for (var idxBoid = 0; idxBoid < numBoids; ++idxBoid) {
      this.drawBoid(context, idxBoid);
    }
  }

  return Flock;
}
