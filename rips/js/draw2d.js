export function drawCircle(context, x, y, radius, color, width) {
  context.beginPath();
  context.moveTo(x + radius, y)
  context.arc(x, y, radius, 0, 2*Math.PI, false);
  context.lineWidth = width;
  context.strokeStyle = color;
  context.stroke();
}

export function drawDot(context, x, y, radius, color) {
  context.beginPath();
  context.fillStyle = color;
  context.arc(x, y, radius, 0, 2*Math.PI, false);
  context.fill();
}
