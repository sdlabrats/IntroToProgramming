//-----------------------------------------------------------
// 🎓 STUDENT ZONE – CHANGE THESE VARIABLES ONE BY ONE!
//-----------------------------------------------------------

// Game character (emoji)
let playerEmoji = "🐤";

// Player physics
let gravityStrength = 0.4;
let flapStrength = -7;

// Pipe settings
let pipeGap = 180;          
let pipeSpeed = 3;          
let pipeWidth = 70;

// Win condition
let winScore = 15;

//-----------------------------------------------------------
// END OF STUDENT ZONE — GAME ENGINE BELOW 👇
//-----------------------------------------------------------

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let width, height;
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
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
let player;
let pipes = [];
let score = 0;
let gameRunning = false;

// Player object
function resetPlayer() {
    player = {
        x: width * 0.25,
        y: height * 0.5,
        velY: 0,
        size: 40
    };
}

function createPipe() {
    let topHeight = Math.random() * (height - pipeGap - 100) + 50;
    let bottomY = topHeight + pipeGap;

    pipes.push({
        x: width,
        topHeight,
        bottomY
    });
}

function startGame() {
    startScreen.classList.add("hidden");
    score = 0;
    pipes = [];
    resetPlayer();
    gameRunning = true;

    createPipe();
    animate();
}

function flap() {
    if (!gameRunning) return;
    player.velY = flapStrength;
}

document.addEventListener("mousedown", flap);
document.addEventListener("touchstart", flap);

// NEW: Spacebar to flap
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault(); // prevents page from scrolling
        flap();
    }
});

// GAME LOOP
function animate() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, width, height);

    // Gravity
    player.velY += gravityStrength;
    player.y += player.velY;

    // Death by floor/ceiling
    if (player.y > height || player.y < 0) return endGame();

    // Move pipes + collision
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        // Pipe collision
        if (
            player.x + player.size > pipe.x &&
            player.x - player.size < pipe.x + pipeWidth
        ) {
            if (player.y < pipe.topHeight || player.y > pipe.bottomY) {
                return endGame();
            }
        }
    });

    // Add new pipes
    if (pipes[pipes.length - 1].x < width - 300) {
        createPipe();
    }

    // Remove old pipes + update score
    if (pipes[0].x + pipeWidth < 0) {
        pipes.shift();
        score++;

        if (score >= winScore) {
            return winGame();
        }
    }

    drawGame();
    requestAnimationFrame(animate);
}

function drawGame() {
    // Draw pipes
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, height - pipe.bottomY);
    });

    // Draw player
    ctx.font = player.size + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(playerEmoji, player.x, player.y);

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText(score, width / 2, 60);
}

function endGame() {
    gameRunning = false;
    gameOverScreen.classList.remove("hidden");
}

function winGame() {
    gameRunning = false;
    winScreen.classList.remove("hidden");
}
