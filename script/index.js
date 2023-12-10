import Controller from "./controller.js";
import Brick from "./brick.js";

// 縮放像素以適配硬體分辨率較高的顯示器
var ratio = window.devicePixelRatio;
function multiRatio(number) {
  return number * ratio;
}

var canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("mainCanvas")
);

canvas.width = multiRatio(canvas.clientWidth);
canvas.height = multiRatio(canvas.clientHeight);
var ctx = canvas.getContext("2d");
// ctx.scale(ratio, ratio);

// 球板
var paddleHeight = multiRatio(10);
var paddleWidth = multiRatio(75);
var paddleX = (canvas.width - paddleWidth) / 2;

/**繪製球板 */
function drawPaddle() {
  ctx.beginPath();
  ctx.fillStyle = "#558899";
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fill();
  ctx.closePath();
}

// 註冊球版到控制器
var paddleDiffX = 7;
var controller = new Controller();
controller.OnLeftKeyDown = function () {
  paddleX -= paddleDiffX;
  if (paddleX < 0) {
    paddleX = 0;
  }
};
controller.OnRightKeyDown = function () {
  paddleX += paddleDiffX;
  if (paddleX + paddleWidth > canvas.width) {
    paddleX = canvas.width - paddleWidth;
  }
};
controller.OnMouseMove = function (e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
  if (paddleX < 0) {
    paddleX = 0;
  } else if (paddleX + paddleWidth > canvas.width) {
    paddleX = canvas.width - paddleWidth;
  }
};

// 球
var ballRadius = multiRatio(5);
var ballX = paddleX + paddleWidth / 2;
var ballY = canvas.height - paddleHeight - ballRadius;
var balldX = 2;
var balldY = -2;

function drawBall() {
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

// 磚塊
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = multiRatio(75);
var brickHeight = multiRatio(40);
var brickPadding = multiRatio(10);
var brickOffsetTop = multiRatio(30);
var brickOffsetLeft = multiRatio(30);
var brickColor = "#ff5555";
var bricks = Array(r);
for (var r = 0; r < brickRowCount; r++) {
  bricks[r] = Array(brickColumnCount);
  for (var c = 0; c < brickColumnCount; c++) {
    var x = brickOffsetLeft + c * brickPadding + c * brickWidth;
    var y = brickOffsetTop + r * brickPadding + r * brickHeight;
    bricks[r][c] = new Brick(x, y, brickWidth, brickHeight, brickColor);
  }
}
/**繪製磚塊 */
function drawBricks() {
  bricks.forEach(function (column) {
    column.forEach(function (brick) {
      brick.Render(ctx);
    });
  });
}

var score = 0;
var maxScore = brickRowCount * brickColumnCount;

/**繪製分數文字 */
function drawScore() {
  ctx.font = "22px Arial";
  ctx.fillStyle = "#eeaaaa";
  ctx.fillText("Score: " + score, 8, 30);
}

/**繪製生命文字 */
var lives = 2;
function drawLives() {
  ctx.font = "22px Arial";
  ctx.fillStyle = "#eeaaaa";
  ctx.fillText("Lives: " + lives, 8, canvas.height - 30);
}

/**簡易的磚塊碰撞檢測 */
function collisionDetection() {
  bricks.forEach(function (column) {
    column.forEach(function (brick) {
      if (
        brick.x < ballX + ballRadius &&
        brick.x + brick.width > ballX - ballRadius &&
        brick.y < ballY + ballRadius &&
        brick.y + brick.height > ballY - ballRadius &&
        brick.status
      ) {
        if (ballY > brick.y && ballY < brick.y + brick.height) {
          balldX = -balldX;
        } else {
          balldY = -balldY;
        }
        brick.status = false;
        score++;
      }
    });
  });
}

var reload = false;

/**主要遊戲邏輯進程 */
function draw() {
  // 用flag防止在GameOver時，alert重複觸發導致reload被延後執行而進入alert無限循環
  if (reload) {
    document.location.reload();
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  controller.Update();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();
  drawLives();
  if (score == maxScore) {
    // clearInterval(interval);
    alert("Win");
    document.location.reload();
  }

  if (
    ballX + balldX - ballRadius < 0 ||
    ballX + balldX + ballRadius > canvas.width
  ) {
    balldX = -balldX;
  }
  if (
    ballY + balldY - ballRadius < 0 ||
    (ballY + balldY + ballRadius > canvas.height - paddleHeight &&
      ballX + balldX >= paddleX &&
      ballX + balldX <= paddleX + paddleWidth)
  ) {
    balldY = -balldY;
  } else if (ballY + balldY + ballRadius >= canvas.height) {
    lives--;
    if (lives > 0) {
      paddleX = (canvas.width - paddleWidth) / 2;
      ballX = paddleX + paddleWidth / 2;
      ballY = canvas.height - paddleHeight - ballRadius;
      balldX = 2;
      balldY = -2;
    } else if (!reload) {
      // clearInterval(interval);
      reload = true;
      alert("Game Over");
    }
  }

  ballX += balldX;
  ballY += balldY;
  // 交給瀏覽器同步幀率
  requestAnimationFrame(draw);
}

// 固定每10ms重新繪製
// var interval = setInterval(draw, 10);
draw();
