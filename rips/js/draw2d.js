export function drawCircle(context, x, y, radius, color, width) {
  context.moveTo(x + radius, y)
  context.arc(x, y, radius, 0, 2*Math.PI, false);
  context.lineWidth = width;
  context.strokeStyle = color;
  context.stroke();
}
