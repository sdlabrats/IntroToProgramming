//-----------------------------------------------------------
// 🎓 STUDENT ZONE – Fun variables you can change!
//-----------------------------------------------------------

let shipEmoji = null;
let asteroidEmoji = null; // e.g. "☄️" or null to use circles

// Number of starting asteroids
let startAsteroids = 3;

let playerAccel = 0.12;
let playerRotSpeed = 0.07;
let playerDrag = 0.995;

// Bullet
let bulletSpeed = 9;
let bulletLife = 90;
let bulletCooldown = 10;

// Asteroid speed range
let asteroidSpeedMin = 0.3;
let asteroidSpeedMax = 2;

// Asteroid sizes (pixels)
let asteroidSizes = {
    massive: 90,
    mega: 64,
    large: 45,
    medium: 28,
    small: 16
};

//-----------------------------------------------------------
// END OF STUDENT ZONE — Game engine below
//-----------------------------------------------------------

// Number of stars per layer
let starsLayer1 = 80;
let starsLayer2 = 140;
let starsLayer3 = 260;

// Star layer speeds
let starsSpeed1 = 1;
let starsSpeed2 = 2;
let starsSpeed3 = 3;

// Asteroid points
let asteroidPoints = {
    massive: 10,
    mega: 20,
    large: 20,
    medium: 50,
    small: 100
};

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let W, H;

function resize() {
    canvas.width = W = window.innerWidth;
    canvas.height = H = window.innerHeight;
}
window.onresize = resize;
resize();
canvas.focus();

// INPUT
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup",   e => keys[e.key] = false);

window.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "r") restartGame();
});

// STARS
function makeStars(count, speed) {
    let arr = [];
    for (let i = 0; i < count; i++) {
        arr.push({ x: Math.random()*W, y: Math.random()*H, tw: Math.random()*Math.PI*2, speed });
    }
    return arr;
}

const stars1 = makeStars(starsLayer1, starsSpeed1);
const stars2 = makeStars(starsLayer2, starsSpeed2);
const stars3 = makeStars(starsLayer3, starsSpeed3);

function drawStars(list) {
    list.forEach(s => {
        s.tw += 0.05;
        let b = 0.5 + Math.sin(s.tw)*0.5;
        ctx.globalAlpha = b;
        ctx.fillStyle = "white";
        ctx.fillRect(s.x, s.y, 2, 2);
        if (player.alive) {
            s.x -= player.vx * (s.speed * 0.03);
            s.y -= player.vy * (s.speed * 0.03);
        }
        if (s.x < 0) s.x += W;
        if (s.x > W) s.x -= W;
        if (s.y < 0) s.y += H;
        if (s.y > H) s.y -= H;
        ctx.globalAlpha = 1;
    });
}

// PLAYER
const player = { x: W/2, y: H/2, vx:0, vy:0, angle:0, alive:true, cooldown:0 };
function resetPlayer() { player.x=W/2; player.y=H/2; player.vx=0; player.vy=0; player.angle=0; player.cooldown=0; player.alive=true; }

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    if (shipEmoji) {
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(shipEmoji, 0, 0);
    } else {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(15,0);
        ctx.lineTo(-10,-10);
        ctx.lineTo(-10,10);
        ctx.closePath();
        ctx.stroke();
        if (keys["ArrowUp"]) {
            ctx.strokeStyle="orange";
            ctx.beginPath();
            ctx.moveTo(-10,-6);
            ctx.lineTo(-23-Math.random()*5,0);
            ctx.lineTo(-10,6);
            ctx.stroke();
        }
    }
    ctx.restore();
}

// BULLETS
let bullets = [];
function shoot() {
    if (player.cooldown>0) return;
    player.cooldown = bulletCooldown;
    bullets.push({ x: player.x+Math.cos(player.angle)*15, y: player.y+Math.sin(player.angle)*15,
                   vx: Math.cos(player.angle)*bulletSpeed, vy: Math.sin(player.angle)*bulletSpeed,
                   life: bulletLife });
}
function updateBullets() {
    bullets.forEach(b=>{ b.x+=b.vx; b.y+=b.vy; b.life--; if(b.x<0)b.x+=W;if(b.x>W)b.x-=W;if(b.y<0)b.y+=H;if(b.y>H)b.y-=H; });
    bullets = bullets.filter(b=>b.life>0);
}
function drawBullets() {
    ctx.fillStyle="white";
    bullets.forEach(b=>{ ctx.beginPath(); ctx.arc(b.x,b.y,2,0,Math.PI*2); ctx.fill(); });
}

// ASTEROIDS
function randSpeed() { return (Math.random()<0.5?-1:1)*(asteroidSpeedMin + Math.random()*(asteroidSpeedMax-asteroidSpeedMin)); }
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function makeAsteroid(size,x=null,y=null){
    let angle = (randInt(1,360)/180)*Math.PI;
    return { x:x??Math.cos(angle)*(W/4), y:y??Math.sin(angle)*(H/4), vx:randSpeed(), vy:randSpeed(), size, r:asteroidSizes[size], hue:Math.random()*360 };
}

let asteroids = [];
function initAsteroids(){
    asteroids=[];
    for(let i=0;i<startAsteroids;i++) asteroids.push(makeAsteroid("massive"));
}

function splitAsteroid(a){
    if(a.size==="massive") return [makeAsteroid("mega",a.x,a.y),makeAsteroid("mega",a.x,a.y)];
    if(a.size==="mega") return [makeAsteroid("large",a.x,a.y),makeAsteroid("large",a.x,a.y)];
    if(a.size==="large") return [makeAsteroid("medium",a.x,a.y),makeAsteroid("medium",a.x,a.y)];
    if(a.size==="medium") return [makeAsteroid("small",a.x,a.y),makeAsteroid("small",a.x,a.y)];
    return [];
}

function updateAsteroids(){
    asteroids.forEach(a=>{ a.x+=a.vx; a.y+=a.vy; if(a.x<0)a.x+=W;if(a.x>W)a.x-=W;if(a.y<0)a.y+=H;if(a.y>H)a.y-=H; a.hue=(a.hue+0.4)%360; });
}

function drawAsteroids(){
    asteroids.forEach(a=>{
        if(asteroidEmoji){
            ctx.font = (a.r*2)+"px Arial";
            ctx.textAlign="center"; ctx.textBaseline="middle";
            ctx.fillText(asteroidEmoji,a.x,a.y);
        } else {
            ctx.strokeStyle=`hsl(${a.hue},90%,60%)`;
            ctx.lineWidth=3;
            ctx.beginPath();
            ctx.arc(a.x,a.y,a.r,0,Math.PI*2);
            ctx.stroke();
        }
    });
}

// COLLISIONS
let score = 0;
function checkCollisions(){
    bullets.forEach((b,bi)=>{
        asteroids.forEach((a,ai)=>{
            const dx=a.x-b.x; const dy=a.y-b.y;
            if(dx*dx+dy*dy<(a.r+2)**2){
                score+=asteroidPoints[a.size];
                document.getElementById("score").innerText="Score: "+score;
                bullets.splice(bi,1);
                const pieces = splitAsteroid(a);
                asteroids.splice(ai,1,...pieces);
            }
        });
    });

    asteroids.forEach(a=>{
        const dx=a.x-player.x; const dy=a.y-player.y;
        if(dx*dx+dy*dy<(a.r+10)**2) player.alive=false;
    });
}

// GAME LOOP
function update(){
    if(!player.alive) return;
    if(keys["ArrowLeft"]) player.angle-=playerRotSpeed;
    if(keys["ArrowRight"]) player.angle+=playerRotSpeed;
    if(keys["ArrowUp"]){ player.vx+=Math.cos(player.angle)*playerAccel; player.vy+=Math.sin(player.angle)*playerAccel; }

    player.vx*=playerDrag; player.vy*=playerDrag;
    if(keys[" "]) shoot();
    if(player.cooldown>0) player.cooldown--;
    player.x=(player.x+player.vx+W)%W;
    player.y=(player.y+player.vy+H)%H;

    updateBullets();
    updateAsteroids();
    checkCollisions();
}

function draw(){
    ctx.clearRect(0,0,W,H);
    drawStars(stars1); drawStars(stars2); drawStars(stars3);
    drawBullets(); drawAsteroids(); drawPlayer();

    if(!player.alive){
        ctx.fillStyle="rgba(0,0,0,0.5)";
        ctx.fillRect(0,0,W,H);
        ctx.fillStyle="white";
        ctx.font="60px monospace";
        ctx.fillText("GAME OVER", W/2-170,H/2-20);
        ctx.font="28px monospace";
        ctx.fillText("Final Score: "+score,W/2-120,H/2+35);
        ctx.font="22px monospace";
        ctx.fillText("Press R to Restart",W/2-120,H/2+80);
    }
}

function loop(){ update(); draw(); requestAnimationFrame(loop); }
function restartGame(){ resetPlayer(); bullets=[]; score=0; document.getElementById("score").innerText="Score: 0"; initAsteroids(); }

initAsteroids();
loop();
