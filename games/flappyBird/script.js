// 🟩 STUDENT ZONE: Try changing these!

// Physics
let gravity = 6;           // Pulling the bird down
let jumpPower = 10;        // How strong the flap

// Pipes
let pipeWidth = 50;        // Width of pipes
let pipeGap = 200;         // Gap between pipes
let pipeDistance = 200; // Minimum distance between pipes (pixels)

// Bird
let birdSpeed = 2.5;         // Horizontal movement speed (for future upgrades)
let birdSize = 30;         // Size of the bird

// Emoji selection
let emoji = ["🐤", "😀", "💩", "👻", "🦋", "🌸", "🚁", "🚀", "🧚", "🐲"];
let birdChar = emoji[Math.floor(Math.random() * emoji.length)];

// Gameplay
let floorHeight = 20;      
let maxScore = 50;         
let speedIncreaseInterval = 10; // Makes it more challenging over time

// Messages
let winMessage = "🎉 You Win!";
let loseMessage = "💥 Game Over!";

// 🟩 END STUDENT ZONE






























let ceilingHeight = 0;     

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreBox = document.getElementById("score");
const messageBox = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

let bird, pipes, score, gameOver;

function resetGame() {
  bird = { x: 80, y: canvas.height / 2, velocity: 0 };
  pipes = [];
  score = 0;
  gameOver = false;
  messageBox.textContent = "";
  restartBtn.style.display = "none";
  spawnPipe();
  updateScore();
  requestAnimationFrame(gameLoop); // ✅ restart the loop
}

function spawnPipe() {
  const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - floorHeight - ceilingHeight)) + ceilingHeight + 20;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - pipeGap - floorHeight,
    passed: false
  });
}

function drawBird() {
  ctx.font = birdSize + "px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(birdChar, bird.x, bird.y);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, ceilingHeight, pipeWidth, pipe.top - ceilingHeight);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom - floorHeight, pipeWidth, pipe.bottom);
  });
}

function drawGround() {
  ctx.fillStyle = "#ded895";
  ctx.fillRect(0, canvas.height - floorHeight, canvas.width, floorHeight);
}

function draw() {
  ctx.fillStyle = "#4ec0ca";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPipes();
  drawBird();
  drawGround();
}

function updateScore() {
  scoreBox.textContent = "Score: " + score;
}

function gameLoop() {
  if (gameOver) return;

  // Bird physics
  bird.velocity += gravity * 0.1;
  bird.y += bird.velocity;

  // Move pipes
  pipes.forEach(pipe => pipe.x -= birdSpeed);

  // Check for passing pipes
  pipes.forEach(pipe => {
    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      pipe.passed = true;
      score++;
      updateScore();
      if (speedIncreaseInterval > 0 && score % speedIncreaseInterval === 0) {
        birdSpeed += 0.5;
      }
      if (score >= maxScore) {
        endGame(winMessage);
      }
    }
  });

  // Remove off-screen pipes
  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

  // Add new pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    spawnPipe();
  }

  // Collision detection
  for (let pipe of pipes) {
    if (
      (bird.x + birdSize / 2 > pipe.x && bird.x - birdSize / 2 < pipe.x + pipeWidth) &&
      (bird.y - birdSize / 2 < pipe.top || bird.y + birdSize / 2 > canvas.height - pipe.bottom - floorHeight)
    ) {
      endGame(loseMessage);
      return;
    }
  }

  // Hit ground or ceiling
  if (bird.y + birdSize / 2 > canvas.height - floorHeight || bird.y - birdSize / 2 < ceilingHeight) {
    endGame(loseMessage);
    return;
  }

  draw();
  requestAnimationFrame(gameLoop);
}

function endGame(message) {
  gameOver = true;
  messageBox.textContent = message;
  restartBtn.style.display = "inline-block";
}

document.addEventListener("keydown", e => {
  if (gameOver) return;
  if (e.key === " " || e.key === "ArrowUp") {
    bird.velocity = -jumpPower;
  }
});

restartBtn.addEventListener("click", resetGame);

resetGame();
gameLoop();
