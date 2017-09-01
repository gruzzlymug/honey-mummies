if (module === undefined) {
  var module = {};
}

module.exports = (function () {
  // --[ BOID ]-----------------------------------------------------------------
  Boid.prototype.numBoids = 0;
  Boid.prototype.pos = [];
  Boid.prototype.vel = [];
  Boid.prototype.neighbors = [];

  function Boid(pos, vel) {
    this.id = Boid.prototype.numBoids++;
    Boid.prototype.pos[this.id] = pos;
    Boid.prototype.vel[this.id] = vel;
    Boid.prototype.neighbors[this.id] = [];
  }

  Boid.prototype.constructor = Boid

  Boid.prototype.update = function(dt) {
    let bvc = 0.99;
    var bv = Boid.prototype.vel[this.id];

    var vm = [0, 0];
    vm[0] = bvc*bv[0];
    vm[1] = bvc*bv[1];

    Boid.prototype.vel[this.id] = vm;
  }

  Boid.prototype.move = function(dt) {
    let vc = 1;
    Boid.prototype.pos[this.id][0] += (vc * Boid.prototype.vel[this.id][0]);
    Boid.prototype.pos[this.id][1] += (vc * Boid.prototype.vel[this.id][1]);
  }

  Boid.prototype.draw = function(context) {
    var x = Boid.prototype.pos[this.id][0];
    var y = Boid.prototype.pos[this.id][1];

    context.beginPath();
    context.fillStyle = "yellow";
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
  function Flock(grid) {
    this.grid = grid;
    this.numBoids = 0;
    this.numActive = 0;
    this.boids = [];
    this.neighborDist = 50;
    this.maxNeighbors = 10;
  }

  Flock.prototype.constructor = Flock

  function createBoid() {
    var p = [30, 30];

    // set velocity (aka heading)
    var v = [(Math.random() - 0.5), (Math.random() - 0.5)];
    v = normalize(v);

    return new Boid(p, v);
  }

  Flock.prototype.spawn = function(dt) {
    var numBoids = this.boids.length;
    this.boids[numBoids] = createBoid();
    ++this.numBoids;
    ++this.numActive;
  }

  Flock.prototype.update = function(dt) {
    this.grid.add(Boid.prototype.pos);
    this.grid.findNeighbors(this.neighborDist, this.maxNeighbors);

    for (var idxBoid = 0; idxBoid < this.numActive; ++idxBoid) {
      this.boids[idxBoid].update(dt);
      this.boids[idxBoid].move(dt);
    }
  }

  Flock.prototype.draw = function(context) {
    var numBoids = this.numBoids;
    for (var idxBoid = 0; idxBoid < numBoids; ++idxBoid) {
      this.boids[idxBoid].draw(context);
    }
  }

  return {
    Boid,
    Flock
  };
})();
