// import Boid from './Boid'
var Grid = require('./grid');
var Flock = require('./flock.js');
import Mildo from './mildo';

//--[ step ]--------------------------------------------------------------
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
    f.update(timestamp);
  }
  f.spawn(0);
  f.debugDraw(context);
  f.draw(context);

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
let f = new Flock(g);
f.createBoids(100);
//f.createSource(ww / 2, wh / 2);
f.createSource(25, 25);

window.requestAnimationFrame(step);
