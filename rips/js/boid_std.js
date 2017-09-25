import { normalize, dot } from './smu.js';

export function update(dt, boidId, neighbors, positions) {
  // velocity modifiers
  var sv = separate(boidId, neighbors, positions);
  var sf = 1;

  var cv = cohere(boidId, neighbors, positions);
  var cf = 0.0;

  var av = align(boidId, neighbors, positions);
  var af = 0.8;

  var gv = gravitate();
  var gf = 0;

  var bv = [0, 0]; //Boid.prototype.vel[boidId];
  let bf = 1;

  // boid vel coefficient
  var vm = [0, 0];
  vm[0] = sf*sv[0] + cf*cv[0] + af*av[0] + gf*gv[0] + bf*bv[0];
  vm[1] = sf*sv[1] + cf*cv[1] + af*av[1] + gf*gv[1] + bf*bv[1];
  // vm = normalize(vm);

  // vm[0] += bv[0];
  // vm[1] += bv[1];
  // vm = normalize(vm);

/*
  var d = dot(bv, vm);
  var tlim = Boid.prototype.turns[boidId];
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
        Boid.prototype.turns[boidId] += side;
        Boid.prototype.turns[boidId] = Math.max(side, -4);
      } else {
        Boid.prototype.turns[boidId] = side;
        return;
      }
    } else {
      if (side == ts) {
        vm = rotate(bv, Boid.prototype.rneg);
        Boid.prototype.turns[boidId] += side;
        Boid.prototype.turns[boidId] = Math.min(side, 4);
      } else {
        Boid.prototype.turns[boidId] = side;
        return;
      }
    }
  }
*/
  // never allow velocity to go to zero (prevents 'freeze' glitch)
  if (dot(vm, vm) < nearlyZero) {
    return [0, 0];
  }
  // Boid.prototype.vel[boidId] = vm;
  return vm;
}

function separate(boidId, neighbors, positions) {
  let numNeighbors = neighbors.length;
  let av = [0, 0];
  let bp = positions[boidId];
  let threshold = 100*100;
  for (let i = 0; i < numNeighbors; ++i) {
    let nid = neighbors[i];
    let np = positions[nid];

    let d = [0, 0];
    d[0] = bp[0] - np[0];
    d[1] = bp[1] - np[1];
    let ds = d[0]*d[0] + d[1]*d[1];
    if (ds < threshold) {
      // NOTE add factor to prevent divide by 0
      ds += 0.1;
      let factor = threshold / ds;
      av[0] += d[0] * factor;
      av[1] += d[1] * factor;
    }
  }
  av = normalize(av);

  return av;
}

function cohere() {
  return [0, 0];
}

function align() {
  return [0, 0];
}

function gravitate() {
  return [0, 0];
}
