if (module === undefined) {
  var module = {};
}

module.exports = (function () {
  // --[ BOID ]-----------------------------------------------------------------
  Boid.prototype.numBoids = 0;
  Boid.prototype.pos = [];
  Boid.prototype.vel = [];

  function Boid(pos) {
    this.id = Boid.prototype.numBoids++;
    Boid.prototype.pos[this.id] = pos;
  }

  Boid.prototype.constructor = Boid

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
    this.boids = [];
  }

  Flock.prototype.constructor = Flock

  function createBoid() {
    var p = [30, 30];

    return new Boid(p);
  }

  Flock.prototype.spawn = function(dt) {
    var numBoids = this.boids.length;
    this.boids[numBoids] = createBoid();
    ++this.numBoids;
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
