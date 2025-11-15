// 🟩 STUDENT ZONE: Try changing these!
const playerChar = "🐸";
const carChar = "🚗";
const carSpeed = 1;
const laneColor = "lightgray";
const winMessage = "🎉 You made it!";
const loseMessage = "💥 You got hit!";

const laneHeight = 60;       // smaller lanes
const numLanes = 6;         // main lanes
const bufferLanes = 1;       // empty lanes between roads
const carsPerLane = 2;
const jumpDistance = laneHeight;
// 🟩 END STUDENT ZONE





































// ============================
// CALCULATE TOTAL LANES & CANVAS
// ============================
const totalLanes = numLanes + bufferLanes * (numLanes - 1);

const canvas = document.getElementById("gameCanvas");
canvas.width = 480;                      // smaller width
canvas.height = totalLanes * laneHeight; // adjust height
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// ============================
// PLAYER SPAWN ON SAFE LANE
// ============================
function getBottomSafeLaneY() {
  for (let i = totalLanes - 1; i >= 0; i--) {
    const isMainLane = (i % (1 + bufferLanes)) === 0; // road lane
    if (!isMainLane) return i * laneHeight;
  }
  return canvasHeight - laneHeight; // fallback
}

let player = { 
  x: Math.floor(numLanes / 2) * laneHeight, 
  y: getBottomSafeLaneY() 
};

// ============================
// CARS
// ============================
let cars = [];
let gameOver = false;

function initCars() {
  cars = [];
  for (let i = 0; i < numLanes; i++) {
    const laneY = (i * (1 + bufferLanes)) * laneHeight;
    for (let j = 0; j < carsPerLane; j++) {
      cars.push({
        x: j * 150,
        y: laneY,
        direction: i % 2 === 0 ? 1 : -1,
        speed: carSpeed + Math.random(),
      });
    }
  }
}

// ============================
// DRAW FUNCTIONS
// ============================
function drawLanes() {
  for (let i = 0; i < totalLanes; i++) {
    const mainLaneIndex = i / (1 + bufferLanes);
    ctx.fillStyle = (mainLaneIndex % 1 === 0) ? laneColor : "#77c22d";
    ctx.fillRect(0, i * laneHeight, canvasWidth, laneHeight);
  }
}

function drawPlayer() {
  ctx.font = `${laneHeight * 0.8}px Arial`;
  ctx.fillText(playerChar, player.x + laneHeight * 0.1, player.y + laneHeight * 0.8);
}

function drawCars() {
  ctx.font = `${laneHeight * 0.7}px Arial`;
  cars.forEach(car => {
    ctx.fillText(carChar, car.x, car.y + laneHeight * 0.7);
  });
}

// ============================
// GAME LOGIC
// ============================
function updateCars() {
  cars.forEach(car => {
    car.x += car.speed * car.direction;
    if (car.x > canvasWidth) car.x = -50;
    if (car.x < -50) car.x = canvasWidth;
  });
}

function checkCollision() {
  cars.forEach(car => {
    const carRect = { x: car.x, y: car.y, w: laneHeight, h: laneHeight };
    const playerRect = { x: player.x, y: player.y, w: laneHeight, h: laneHeight };
    if (
      playerRect.x < carRect.x + carRect.w &&
      playerRect.x + playerRect.w > carRect.x &&
      playerRect.y < carRect.y + carRect.h &&
      playerRect.y + playerRect.h > carRect.y
    ) {
      gameOver = true;
    }
  });

  if (player.y <= 0) {
    alert(winMessage);
    resetGame();
  }
}

// ============================
// PLAYER MOVEMENT
// ============================
document.addEventListener("keydown", e => {
  if (gameOver) return;
  switch (e.key) {
    case "ArrowUp": player.y -= jumpDistance; break;
    case "ArrowDown": player.y += jumpDistance; break;
    case "ArrowLeft": player.x -= jumpDistance; break;
    case "ArrowRight": player.x += jumpDistance; break;
  }
  player.x = Math.max(0, Math.min(canvasWidth - laneHeight, player.x));
  player.y = Math.max(0, Math.min(canvasHeight - laneHeight, player.y));
});

// ============================
// GAME LOOP
// ============================
function gameLoop() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawLanes();
  updateCars();
  drawCars();
  drawPlayer();
  checkCollision();

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText(loseMessage, canvasWidth / 2 - 120, canvasHeight / 2);
  } else {
    requestAnimationFrame(gameLoop);
  }
}

// ============================
// RESET GAME
// ============================
function resetGame() {
  player = { x: Math.floor(numLanes / 2) * laneHeight, y: getBottomSafeLaneY() };
  gameOver = false;
  initCars();
  gameLoop();
}

// ============================
// RESTART BUTTON
// ============================
const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", () => resetGame());

// ============================
// START
// ============================
initCars();
gameLoop();
