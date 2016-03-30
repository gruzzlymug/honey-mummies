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

Grid.prototype.clear = function() {
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

Grid.prototype.query = function(qx, qy) {
  var xc = Math.floor(qx / Grid.prototype.minCellDim);
  var yc = Math.floor(qy / Grid.prototype.minCellDim);

  var candidates = [];
  var x0 = Math.max(0, xc - 1);
  var x1 = Math.min(Grid.prototype.field.length, xc + 1);
  var y0 = Math.max(0, yc - 1);
  var y1 = Math.min(Grid.prototype.field[0].length, yc + 1);
  for (var x = x0; x <= x1; ++x) {
    for (var y = y0; y <= y1; ++y) {
      var fff = Grid.prototype.field[xc][yc];
      var qmv = fff;
    }
  }
}
