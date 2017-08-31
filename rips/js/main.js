require(['smu', 'grid', 'b2'], function(u, p){
  function step(timestamp) {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    f.update(timestamp);
    f.move(timestamp);
    f.draw(context);

    window.requestAnimationFrame(step);
  }

  let Boid = module.exports.Boid;
  let Flock = module.exports.Flock;

  var canvas = document.getElementById('field');
  var context = canvas.getContext('2d');
  var last = performance.now();
  var startTime = last;
  var frame = 0;

  var g = new Grid(200, 200, 50);
  var f = new Flock(g);

  f.spawn(0);

  window.requestAnimationFrame(step);
});
