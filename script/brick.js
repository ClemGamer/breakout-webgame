function Brick(x = 0, y = 0, width = 100, height = 40, color = "#000000") {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  /**是否繪製 */
  this.status = true;
}

Brick.prototype.Render = function (ctx) {
  if (!this.status) {
    return;
  }
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.rect(this.x, this.y, this.width, this.height);
  ctx.fill();
  ctx.closePath();
};

export default Brick;