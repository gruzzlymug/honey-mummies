module.exports = (function () {
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
    var width = 200; //context.canvas.width - 1;
    var height = 200; //context.canvas.height - 1;

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

  return Boid;
})();
