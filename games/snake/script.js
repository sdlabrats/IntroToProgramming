//-----------------------------------------------------------
// 🎓 STUDENT ZONE – Fun variables you can change!
//-----------------------------------------------------------

let snakeEmoji = "🟩";
let foodEmoji = "🍎";
let bonusFoodEmoji = "⭐";

let gridSize = 20;

let snakeStartLength = 3;
let snakeSpeed = 150;

let snakeGrowth = 2;

let bonusFoodChance = 20;

let wallCollision = true;

//-----------------------------------------------------------
// END OF STUDENT ZONE — Game engine below
//-----------------------------------------------------------

// Player controls wrap around (true = teleport to opposite edge, only works if wallCollision=false)
let wrapAround = !wallCollision;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let width, height, cellSize;
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cellSize = Math.min(width, height) / gridSize;
}
resize();
window.addEventListener("resize", resize);

// Screens
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const winScreen = document.getElementById("winScreen");

document.getElementById("startBtn").onclick = startGame;
document.querySelectorAll(".restartBtn").forEach(btn => {
    btn.onclick = () => {
        gameOverScreen.classList.add("hidden");
        winScreen.classList.add("hidden");
        startGame();
    };
});

// Game variables
let snake, food, direction, nextDirection, gameRunning, score;

function startGame() {
    snake = [];
    for (let i = 0; i < snakeStartLength; i++) {
        snake.push({x: Math.floor(gridSize/2), y: Math.floor(gridSize/2) + i});
    }
    direction = "up";
    nextDirection = "up";
    spawnFood();
    gameRunning = true;
    score = 0;

    startScreen.classList.add("hidden");
    gameLoop();
}

function spawnFood() {
    let isBonus = Math.random() * 100 < bonusFoodChance;
    food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
        emoji: isBonus ? bonusFoodEmoji : foodEmoji,
        bonus: isBonus
    };
}

document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp" && direction !== "down") nextDirection = "up";
    if (e.code === "ArrowDown" && direction !== "up") nextDirection = "down";
    if (e.code === "ArrowLeft" && direction !== "right") nextDirection = "left";
    if (e.code === "ArrowRight" && direction !== "left") nextDirection = "right";
    if (e.code === "KeyW" && direction !== "down") nextDirection = "up";
    if (e.code === "KeyS" && direction !== "up") nextDirection = "down";
    if (e.code === "KeyA" && direction !== "right") nextDirection = "left";
    if (e.code === "KeyD" && direction !== "left") nextDirection = "right";
});

function gameLoop() {
    if (!gameRunning) return;

    direction = nextDirection;

    let head = { ...snake[0] };
    if (direction === "up") head.y--;
    if (direction === "down") head.y++;
    if (direction === "left") head.x--;
    if (direction === "right") head.x++;

    // Wall collision or wrap around
    if (wallCollision) {
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) return endGame();
    } else if (wrapAround) {
        if (head.x < 0) head.x = gridSize - 1;
        if (head.x >= gridSize) head.x = 0;
        if (head.y < 0) head.y = gridSize - 1;
        if (head.y >= gridSize) head.y = 0;
    }

    // Check collision with self
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) return endGame();
    }

    snake.unshift(head);

    // Check food
    if (head.x === food.x && head.y === food.y) {
        for (let i = 1; i < snakeGrowth; i++) snake.push({...snake[snake.length-1]});
        score += food.bonus ? 5 : 1;
        spawnFood();
    } else {
        snake.pop();
    }

    draw();

    setTimeout(gameLoop, snakeSpeed);
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, cellSize * gridSize, cellSize * gridSize);

    ctx.font = cellSize + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw food
    ctx.fillText(food.emoji, food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2);

    // Draw snake
    for (let segment of snake) {
        ctx.fillText(snakeEmoji, segment.x * cellSize + cellSize / 2, segment.y * cellSize + cellSize / 2);
    }
}

function endGame() {
    gameRunning = false;
    gameOverScreen.classList.remove("hidden");
}

function winGame() {
    gameRunning = false;
    winScreen.classList.remove("hidden");
}
