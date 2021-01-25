// import Boid from './Boid'
import GridFunction from './grid';
import FlockFunction from './flock.js';
import Mildo from './mildo';

const Grid = GridFunction();
const Flock = FlockFunction();

var flocks = [];

//--[ step ]--------------------------------------------------------------
// globals
// - flocks
// - ?
function step(timestamp) {
  let frameTimeMs = timestamp - last;
  last = timestamp;
  // console.log(frameTimeMs);

  // frames per second
  let elapsedTime = (timestamp - startTime) / 1000,
  result = Math.floor((frame / elapsedTime));
  if (elapsedTime > 1) {
    startTime = timestamp;
    frame = 0;
  }
  if (frame % 10 == 0) {
    let fpsText = result.toString();
    // console.log(fpsText);
  }
  ++frame;

  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (frame % 3 === 0) {
    for (var i = 0, len = flocks.length; i < len; ++i) {
      flocks[i].update(timestamp);
    }
  }
  for (var i = 0, len = flocks.length; i < len; ++i) {
    flocks[i].spawn(0);
  }
  for (var i = 0, len = flocks.length; i < len; ++i) {
    flocks[i].debugDraw(context);
  }
  for (var i = 0, len = flocks.length; i < len; ++i) {
    flocks[i].draw(context);
  }

  window.requestAnimationFrame(step);
}

//------------------------------------------------------------------------
var last = performance.now();
var startTime = last;
var frame = 0;

let m = new Mildo();

let ww = window.innerWidth;
let wh = window.innerHeight;
var canvas = document.getElementById('field');
var context = canvas.getContext('2d');
context.canvas.width = ww;
context.canvas.height = wh;

let g = new Grid(ww, wh, 100);
flocks.push(new Flock(g));
flocks[0].createBoids(3);
//f.createSource(ww / 2, wh / 2);
flocks[0].createSource(25, 25);

let x = new Flock(g);
x.createBoids(1);
x.createSource(75, 75);

window.requestAnimationFrame(step);
