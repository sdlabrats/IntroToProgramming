// 🟩 STUDENT ZONE: Try changing these!

// Appearance
let snakeColor = "yellow";          // Color of the snake
let foodColor = "blue";             // Color of the food
let gridSize = 20;                  // Size of each square in pixels

// Game mechanics
let moveSpeed = 40;                // Milliseconds between moves (lower = faster)
let initialSnakeLength = 3;         // Starting length of the snake
let wallCollision = false;           // true = hitting wall ends game, false = wraps around

// Score
let showScore = true;               // Display score on screen
let scoreColor = "white";           // Score text color
let winLength = 50;                 // Optional: win when snake reaches this length

// Messages
let winMessage = "🎉 You Win!";
let loseMessage = "💥 Game Over!";

// 🟩 END STUDENT ZONE



























moveSpeed = 1000/moveSpeed


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const messageBox = document.getElementById("message");
const scoreBox = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

let snake, food, direction, gameOver, score;

function resetGame() {
  snake = [];
  for (let i = 0; i < initialSnakeLength; i++) {
    snake.push({ x: 10 - i, y: 10 });
  }
  direction = { x: 1, y: 0 };
  food = spawnFood();
  gameOver = false;
  score = 0;
  messageBox.textContent = "";
  restartBtn.style.display = "none";
  updateScore();
}

function spawnFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * (canvas.width / gridSize));
    y = Math.floor(Math.random() * (canvas.height / gridSize));
  } while (snake.some(seg => seg.x === x && seg.y === y));
  return { x, y };
}

function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  drawSquare(food.x, food.y, foodColor);

  // Draw snake
  snake.forEach(seg => drawSquare(seg.x, seg.y, snakeColor));
}

function moveSnake() {
  if (gameOver) return;

  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Wrap around or collision
  if (!wallCollision) {
    if (head.x < 0) head.x = canvas.width / gridSize - 1;
    if (head.x >= canvas.width / gridSize) head.x = 0;
    if (head.y < 0) head.y = canvas.height / gridSize - 1;
    if (head.y >= canvas.height / gridSize) head.y = 0;
  } else {
    if (head.x < 0 || head.x >= canvas.width / gridSize ||
        head.y < 0 || head.y >= canvas.height / gridSize) {
      endGame(loseMessage);
      return;
    }
  }

  // Check collision with self
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    endGame(loseMessage);
    return;
  }

  snake.unshift(head);

  // Check food
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = spawnFood();
    if (snake.length >= winLength) {
      endGame(winMessage);
    }
  } else {
    snake.pop();
  }

  updateScore();
}

function updateScore() {
  if (showScore) scoreBox.textContent = "Score: " + score;
  scoreBox.style.color = scoreColor;
}

function endGame(message) {
  gameOver = true;
  messageBox.textContent = message;
  restartBtn.style.display = "inline-block";
}

document.addEventListener("keydown", e => {
  if (gameOver) return;
  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
});

restartBtn.addEventListener("click", resetGame);

resetGame();
draw();
setInterval(() => {
  moveSnake();
  draw();
}, moveSpeed);
