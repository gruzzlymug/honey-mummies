//
// Simulation Math Utilities
//
if (module === undefined) {
  var module = {};
}

module.exports = (function () {
  this.nearlyZero = 0.0001;

  this.normalize = function (v) {
    let lv = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
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

  function randomInRange(min, max, wantInt) {
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
