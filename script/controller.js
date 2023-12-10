function Controller(name = "default") {
  this.name = name;
  this.leftKeyPressed = false;
  this.rightKeyPressed = false;

  this.OnLeftKeyDown = function () {
    console.log("left");
  };
  this.OnRightKeyDown = function () {
    console.log("right");
  };
  this.OnMouseMove = function (e) {};

  document.addEventListener("keydown", this.KeyDownHandler.bind(this), false);
  document.addEventListener("keyup", this.KeyUpHandler.bind(this), false);
  document.addEventListener("mousemove", this.MouseMoveHandler.bind(this), false);
}

Controller.prototype.KeyDownHandler = function (e) {
  switch (e.keyCode) {
    case 37:
      this.leftKeyPressed = true;
      break;
    case 39:
      this.rightKeyPressed = true;
      break;
  }
};

Controller.prototype.KeyUpHandler = function (e) {
  switch (e.keyCode) {
    case 37:
      this.leftKeyPressed = false;
      break;
    case 39:
      this.rightKeyPressed = false;
      break;
  }
};

Controller.prototype.Update = function () {
  if (this.leftKeyPressed) {
    this.OnLeftKeyDown();
  } else if (this.rightKeyPressed) {
    this.OnRightKeyDown();
  }
};

Controller.prototype.MouseMoveHandler = function (e) {
  this.OnMouseMove(e);
}

export default Controller;
