Screen.prototype.id = 0;

function Screen(title) {
  this.id = Screen.prototype.id++;
  this.frame = 0;
  this.title = title;

  var menuFsm = StateMachine.create({
    initial: 'hidden',
    events: [
      { name: 'show',     from: 'hidden',               to: 'visible' },
      { name: 'hide',     from: 'visible',              to: 'hidden' }
    ]
  });
}

Screen.prototype.show = function() {

}

Screen.prototype.hide = function() {

}

Screen.prototype.step = function() {
  screenStep(0);
}

Screen.prototype.drawBall = function(letter, x, y, dotRadius) {
  context.beginPath();
  context.strokeStyle = "white";
  context.fillStyle = "black";
  context.arc(x, y, dotRadius, 0, 2*Math.PI, false);
  context.fill();
  context.stroke();
  context.closePath();

  var w = context.measureText(letter);
  var o = x - w.width / 2.0;
  context.fillStyle = "white";
  context.fillText(letter, o, y + 7);
}

Screen.prototype.step = function(timestamp) {
  context.fillStyle = "lightgray";
  context.fillRect(0, 0, canvas.width, canvas.height);

  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;

  var text = this.title;
  var numDots = text.length;
  var dotRadius = 21;
  var border = 15;

  var startX = centerX - (numDots * dotRadius * 2 + border * (numDots - 1)) / 2 + dotRadius;
  var dropHeight = centerY + 2 * dotRadius;

  context.font = '14pt Futura';

  var speed = 16;
  var aaa = dropHeight / speed;
  var numStable = Math.min(Math.floor(this.frame / aaa), numDots);
  // stable title
  for (var idxDot = 0; idxDot < numStable; ++idxDot) {
    var letter = text[idxDot];
    this.drawBall(letter, startX, centerY, dotRadius);
    startX += 2 * dotRadius + border;
  }
  // falling title
  var yyy = this.frame % aaa;
  if (this.frame < numDots * aaa) {
    posY = Math.round(centerY - dropHeight + (speed * yyy));

    // var ppyy = c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;

    var letter = text[numStable];
    this.drawBall(letter, startX, posY, dotRadius);
    startX += 2 * dotRadius + border;
  }

  ++this.frame;
}
