//
// Simulation Math Utilities
//
// TODO FIX
// TODO this is just throwing everything into the
//      global namespace...
module.exports = (function () {
  this.nearlyZero = 0.00001;

  this.normalize = function (v) {
    let lv = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
    if (Math.abs(lv) > nearlyZero) {
      v[0] /= lv;
      v[1] /= lv;
    }
    return v;
  }

  this.dot = function(v1, v2) {
    return v1[0]*v2[0] + v1[1]*v2[1]
  }

  this.buildRotationMatrix = function(degrees) {
    var radians = degrees * Math.PI / 180.0;
    var matrix = [
      [Math.cos(radians), -Math.sin(radians)],
      [Math.sin(radians), Math.cos(radians)],
    ];
    return matrix;
  }

  this.rotate = function(v, m) {
    var x = m[0][0]*v[0] + m[0][1]*v[1]
    var y = m[1][0]*v[0] + m[1][1]*v[1]
    return [x, y];
  }

  this.randomInRange = function(min, max, wantInt) {
    var max = (max === 0 || max) ? max : 1,
        min = min || 0,
        gen = min + (max - min) * Math.random();

    return (wantInt) ? Math.round(gen) : gen;
  }

  return {
    // normalize: normalize,
    dot: dot,
    buildRotationMatrix: buildRotationMatrix,
    rotate: rotate,
    randomInRange: randomInRange
  };
})();
