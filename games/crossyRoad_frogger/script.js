//-----------------------------------------------------------
// 🎓 STUDENT ZONE – Fun variables you can change!
//-----------------------------------------------------------

// Player emoji
let myPlayerEmoji = "🐸";

// How many vertical lanes
let numberOfLanes = 16; 

// Player movement per key press
let playerStep = 60;

// Enemy (car) emoji(s)
let carEmojis = ["🚗","🚙","🛻","🏎️"];

// How fast the cars move (pixels per frame)
let carSpeed = 3;

// How often cars appear (frames between spawns; smaller = more cars)
let carFrequency = 20;

// Chance a lane has cars (0 = no cars, 100 = all lanes are roads)
let roadChance = 50; 

// Player size multiplier (1 = normal, 2 = double size)
let playerSizeFactor = 1;

// Car size multiplier (1 = normal, 2 = double size)
let carSizeFactor = 1;

// Extra speed boost for player (pixels per step)
let playerSpeedBoost = 0;

// Grass lane colors
let grassColor1 = "#55c227ff";
let grassColor2 = "#41b40cff";

// Road lane color
let roadColor = "#555555";

//-----------------------------------------------------------
// END OF STUDENT ZONE — Game engine below
//-----------------------------------------------------------

// Chance for special "bonus lane" (0–100)
let bonusLaneChance = 0;

// Finish line lane (1 = top lane)
let finishLane = 1;

// Player always starts at second-to-last lane
let startingLane = numberOfLanes - 1;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let width, height, laneHeight;
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    laneHeight = height / numberOfLanes;
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

// Game objects
let player;
let cars = [];
let frameCount = 0;
let gameRunning = false;
let laneTypes = []; // 0 = grass/padding, 1 = road
let bonusLanes = []; // lanes with bonus items

function createPlayer() {
    player = {
        x: width / 2,
        lane: startingLane,
        size: laneHeight * 0.8 * playerSizeFactor,
        get y() { return this.lane * laneHeight; }
    };
}

function generateLanes() {
    laneTypes = [];
    bonusLanes = [];
    for (let i = 0; i < numberOfLanes; i++) {
        if (i === finishLane || i === startingLane) {
            laneTypes.push(0); // safe lanes
        } else {
            laneTypes.push(Math.random() * 100 < roadChance ? 1 : 0);
        }

        // Decide bonus lane
        bonusLanes[i] = Math.random() * 100 < bonusLaneChance;
    }
}

function spawnCar() {
    // Only spawn cars on road lanes
    let roadLanes = laneTypes.map((type, idx) => type === 1 ? idx : -1).filter(i => i !== -1);
    if (roadLanes.length === 0) return;
    let lane = roadLanes[Math.floor(Math.random() * roadLanes.length)];

    cars.push({
        x: -100,
        lane,
        size: laneHeight * 0.8 * carSizeFactor,
        emoji: carEmojis[Math.floor(Math.random() * carEmojis.length)]
    });
}

function prefillCars() {
    let roadLanes = laneTypes
        .map((type, idx) => type === 1 ? idx : -1)
        .filter(i => i !== -1);

    roadLanes.forEach(lane => {
        // Add 3–6 cars per lane spaced out
        let carsInLane = Math.floor(Math.random() * 3) + 3;

        for (let i = 0; i < carsInLane; i++) {
            cars.push({
                x: Math.random() * width * 2, // spread across 2 screens
                lane,
                size: laneHeight * 0.8 * carSizeFactor,
                emoji: carEmojis[Math.floor(Math.random() * carEmojis.length)]
            });
        }
    });
}

function startGame() {
    startScreen.classList.add("hidden");

    generateLanes();
    createPlayer();
    cars = [];
    frameCount = 0;

    // 🚗 Pre-populate cars on every road lane
    prefillCars();

    gameRunning = true;
    animate();
}

// Movement controls
function moveUp() {
    if (!gameRunning) return;
    if (player.lane > finishLane) player.lane--;
    else return winGame();
}
function moveDown() {
    if (!gameRunning) return;
    if (player.lane < numberOfLanes - 1) player.lane++;
}
function moveLeft() {
    if (!gameRunning) return;
    player.x -= playerStep + playerSpeedBoost;
    if(player.x < 0) player.x = 0;
}
function moveRight() {
    if (!gameRunning) return;
    player.x += playerStep + playerSpeedBoost;
    if(player.x > width) player.x = width;
}

document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") moveUp();
    if (e.code === "ArrowDown" || e.code === "KeyS") moveDown();
    if (e.code === "ArrowLeft" || e.code === "KeyA") moveLeft();
    if (e.code === "ArrowRight" || e.code === "KeyD") moveRight();
});

// GAME LOOP
function animate() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, width, height);

    // Draw lanes
    for (let i = 0; i < numberOfLanes; i++) {
        if (laneTypes[i] === 1) {
            ctx.fillStyle = roadColor; // road
        } else {
            ctx.fillStyle = i % 2 === 0 ? grassColor1 : grassColor2; // grass/padding
        }
        ctx.fillRect(0, i * laneHeight, width, laneHeight);

        // Draw bonus indicator
        if (bonusLanes[i]) {
            ctx.font = laneHeight * 0.5 + "px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("⭐", width - 30, i * laneHeight + laneHeight / 2);
        }
    }

    // Spawn cars
    if (frameCount % carFrequency === 0) spawnCar();

    // Move & draw cars
    cars.forEach(car => {
        car.x += carSpeed;
        ctx.font = car.size + "px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(car.emoji, car.x, car.lane * laneHeight + laneHeight / 2);

        // Collision
        if (Math.abs(car.x - player.x) < laneHeight * 0.6 && car.lane === player.lane) {
            return endGame();
        }
    });

    // Draw player
    ctx.font = player.size + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(myPlayerEmoji, player.x, player.y + laneHeight / 2);

    frameCount++;
    requestAnimationFrame(animate);
}

function endGame() {
    gameRunning = false;
    gameOverScreen.classList.remove("hidden");
}

function winGame() {
    gameRunning = false;
    winScreen.classList.remove("hidden");
}
