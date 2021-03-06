Grid.prototype.width = 0;
Grid.prototype.height = 0;
Grid.prototype.cx = 0;
Grid.prototype.cy = 0;
Grid.prototype.minCellDim = 0;
Grid.prototype.field = [];

function Grid(width, height, minCellDim) {
  Grid.prototype.field = [];

  // x
  Grid.prototype.width = width;
  Grid.prototype.cx = Math.ceil(width / minCellDim);

  // y
  Grid.prototype.height = height;
  Grid.prototype.cy = Math.ceil(height / minCellDim);

  Grid.prototype.minCellDim = minCellDim;

  for (var x = 0; x < Grid.prototype.cx; ++x) {
    Grid.prototype.field[x] = []
    for (var y = 0; y < Grid.prototype.cy; ++y) {
      Grid.prototype.field[x].push([]);
    }
  }

  var endit = 0;
}

Grid.prototype.add = function(positions) {
  // clear the grid
  for (var x = 0; x < Grid.prototype.field.length; ++x) {
    for (var y = 0; y < Grid.prototype.field[0].length; ++y) {
      Grid.prototype.field[x][y] = []
    }
  }

  // do the adding
  var numPositions = positions.length;
  for (var idxPos = 0; idxPos < numPositions; ++idxPos) {
    var bp = positions[idxPos];
    var xc = Math.floor(bp[0] / Grid.prototype.minCellDim);
    var yc = Math.floor(bp[1] / Grid.prototype.minCellDim);
    if (Grid.prototype.field[xc] === undefined) {
      var break_here = true;
    }
    Grid.prototype.field[xc][yc].push(idxPos);
    Boid.prototype.hue[idxPos] = ((yc + xc) % 2) == 0 ? "blue" : "green"
  }

  // save the positions for the queries
  Grid.prototype.positions = positions;
}

Grid.prototype.query = function(mx, my) {
  var xc = Math.floor(mx / Grid.prototype.minCellDim);
  var yc = Math.floor(my / Grid.prototype.minCellDim);

  var selectedID = null;
  var minToBoidSqr = Grid.prototype.minCellDim * Grid.prototype.minCellDim;
  var candidates = Grid.prototype.field[xc][yc];
  var numCandidates = candidates.length;
  for (var idxCandidate = 0; idxCandidate < numCandidates; ++idxCandidate) {
    var candidateID = candidates[idxCandidate];
    var pos = Grid.prototype.positions[candidateID];
    var dx = pos[0] - mx;
    var dy = pos[1] - my;
    var toBoidSqr = dx*dx + dy*dy;
    if (toBoidSqr < 121 && toBoidSqr < minToBoidSqr) {
      selectedID = candidateID;
      minToBoidSqr = toBoidSqr;
    }
  }

  return selectedID;
}

Grid.prototype.findNeighbors = function(threshold, maxNeighbors) {
  var scaleFactor = 1000;
  var numBoids = Boid.prototype.numBoids;

  for (var idxBoid = 0; idxBoid < numBoids; ++idxBoid) {
    var bp = Boid.prototype.pos[idxBoid];
    var qx = bp[0];
    var qy = bp[1];

    var x0 = Math.floor((qx - threshold) / Grid.prototype.minCellDim);
    x0 = Math.max(0, x0);
    var x1 = Math.floor((qx + threshold) / Grid.prototype.minCellDim);
    x1 = Math.min(Grid.prototype.field.length - 1, x1);
    var y0 = Math.floor((qy - threshold) / Grid.prototype.minCellDim);
    y0 = Math.max(0, y0);
    var y1 = Math.floor((qy + threshold) / Grid.prototype.minCellDim);
    y1 = Math.min(Grid.prototype.field[0].length - 1, y1);

    var candidates = [];
    for (var x = x0; x <= x1; ++x) {
      for (var y = y0; y <= y1; ++y) {
        candidates.push.apply(candidates, Grid.prototype.field[x][y]);
      }
    }

    var neighbors = [];
    var tsqr = threshold * threshold;
    var numCandidates = candidates.length;
    for (var idxCandidate = 0; idxCandidate < numCandidates; ++idxCandidate) {
      var candidateID = candidates[idxCandidate];
      var cpos = Grid.prototype.positions[candidateID];
      var dx = cpos[0] - qx;
      var dy = cpos[1] - qy;
      var dsqr = dx*dx + dy*dy;
      if (dsqr <= tsqr && dsqr > nearlyZero) {
        neighbors.push(Math.ceil(dsqr) * scaleFactor + candidateID);
      }
    }
    // sort neighbors to get the closest
    neighbors = neighbors.sort(function(a,b){return a-b});
    neighbors = neighbors.slice(0, maxNeighbors);
    // strip off the position info to leave the IDs
    Boid.prototype.neighbors[idxBoid] = neighbors.map(function(x){return x % scaleFactor});
  }
}
