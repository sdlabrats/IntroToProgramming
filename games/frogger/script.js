// === STUDENT ZONE: Customize your game here! ===
const playerChar = "🐸";
const carChar = "🚗";
const carSpeed = 2.5;
const laneColors = ["lightgray", "gray", "darkgray"];
const winMessage = "🎉 You made it!";
const loseMessage = "💥 You got hit!";
const bgMusic = ""; // Optional
// ===============================================



























// Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 40;
let keys = {};

let player = {
  x: 4,
  y: 9
};

let cars = [];

// Create cars in random lanes
function initCars() {
  cars = [];
  for (let lane = 1; lane <= 7; lane += 2) {
    for (let i = 0; i < 2; i++) {
      cars.push({
        x: Math.random() * 10,
        y: lane,
        speed: (Math.random() < 0.5 ? -1 : 1) * (carSpeed + Math.random())
      });
    }
  }
}

function drawTile(x, y, char, color = "black") {
  ctx.fillStyle = color;
  ctx.font = "30px Arial";
  ctx.fillText(char, x * tileSize + 10, y * tileSize + 30);
}

function drawLanes() {
  for (let y = 1; y <= 7; y++) {
    ctx.fillStyle = laneColors[y % laneColors.length];
    ctx.fillRect(0, y * tileSize, canvas.width, tileSize);
  }
}

function updateCars() {
  for (let car of cars) {
    car.x += car.speed * 0.05;
    if (car.x > 10) car.x = -1;
    if (car.x < -1) car.x = 10;
    drawTile(Math.floor(car.x), car.y, carChar);
  }
}

function checkCollision() {
  for (let car of cars) {
    if (Math.floor(car.x) === player.x && car.y === player.y) {
      alert(loseMessage);
      resetGame();
    }
  }
}

function checkWin() {
  if (player.y === 0) {
    alert(winMessage);
    resetGame();
  }
}

function drawPlayer() {
  drawTile(player.x, player.y, playerChar, "green");
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLanes();
  updateCars();
  drawPlayer();
  checkCollision();
  checkWin();
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  player.x = 4;
  player.y = 9;
  initCars();
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (e.key === "ArrowUp" && player.y > 0) player.y--;
  if (e.key === "ArrowDown" && player.y < 9) player.y++;
  if (e.key === "ArrowLeft" && player.x > 0) player.x--;
  if (e.key === "ArrowRight" && player.x < 9) player.x++;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

resetGame();
gameLoop();
