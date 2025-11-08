// 🟩 STUDENT ZONE: Try changing these!
  let gravity = 4; 
  let jumpPower = 10;
  let birdSize = 30;
  let pipeWidth = 50;
  let pipeGap = 150;



  let emoji = ["🐤", "😀", "💩", "👻", "🦋", "🌸", "🚁", "🚀", "🧚", "🐲"];
  let birdChar; 
// 🟩 END STUDENT ZONE
































const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdY = canvas.height / 2;
let birdVelocity = 0;

let pipes = [];
let frame = 0;
let gameOver = false;

document.addEventListener("keydown", () => {
  if (!gameOver) {
    birdVelocity = -1 * jumpPower;
  } else {
    // Reset game
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    frame = 0;
    gameOver = false;
  }
});

function drawBird() {
  if (birdChar) {
    ctx.font = `${birdSize}px Arial`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(birdChar, 100, birdY);
  } else {
    ctx.fillStyle = "yellow";
    ctx.fillRect(100, birdY, birdSize, birdSize);
  }
} 

function drawPipes() {
  ctx.fillStyle = "green";
  for (let pipe of pipes) {
    // Top pipe
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    // Bottom pipe
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height);
  }
}

function update() {
  if (gameOver) return;

  // Move bird
  birdVelocity += .1 * gravity;
  birdY += birdVelocity;

  // Add pipes
  if (frame % 90 === 0) {
    let top = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({ x: canvas.width, top });
  }

  // Move and remove pipes
  for (let pipe of pipes) {
    pipe.x -= 2;
  }
  pipes = pipes.filter(p => p.x + pipeWidth > 0);

  // Check collisions
  for (let pipe of pipes) {
    if (
      100 + birdSize > pipe.x && 100 < pipe.x + pipeWidth &&
      (birdY < pipe.top || birdY + birdSize > pipe.top + pipeGap)
    ) {
      gameOver = true;
    }
  }

  // Check ground / ceiling
  if (birdY + birdSize > canvas.height || birdY < 0) {
    gameOver = true;
  }

  frame++;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", 120, canvas.height / 2);
    ctx.font = "16px Arial";
    ctx.fillText("Press any key to restart", 110, canvas.height / 2 + 30);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
