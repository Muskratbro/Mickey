// ==========================
// main.js
// ==========================

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player (Mickey) setup
const player = {
    x: 50,
    y: 50,
    width: 32,
    height: 32,
    speed: 2
};

// Current level
let currentLevel = null;

// ==========================
// Load Level
// ==========================
function loadLevel(level) {
    currentLevel = level;
    player.x = level.startX;
    player.y = level.startY;
}

// ==========================
// Keyboard Input
// ==========================
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// ==========================
// Collision Detection
// ==========================
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// ==========================
// Player Movement
// ==========================
function update() {
    let newX = player.x;
    let newY = player.y;

    if (keys["ArrowUp"] || keys["w"]) newY -= player.speed;
    if (keys["ArrowDown"] || keys["s"]) newY += player.speed;
    if (keys["ArrowLeft"] || keys["a"]) newX -= player.speed;
    if (keys["ArrowRight"] || keys["d"]) newX += player.speed;

    // Check collisions with walls
    const tempPlayer = {...player, x: newX, y: newY};
    let collision = false;
    for (const wall of currentLevel.walls) {
        if (isColliding(tempPlayer, wall)) {
            collision = true;
            break;
        }
    }

    if (!collision) {
        player.x = newX;
        player.y = newY;
    }

    // Check bottom level transition
    if (player.y + player.height >= canvas.height) {
        if (currentLevel.nextLevel) {
            loadLevel(currentLevel.nextLevel);
        } else {
            console.log("No next level defined!");
        }
    }
}

// ==========================
// Multi-line Text Helper
// ==========================
function drawText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
            ctx.fillText(line, x, currentY);
            line = words[i] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
}

// ==========================
// Draw Everything
// ==========================
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw walls
    ctx.fillStyle = "#333";
    for (const wall of currentLevel.walls) {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }

    // Draw player (red block for Mickey)
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw level text (permanent)
    if (currentLevel.text) {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        drawText(currentLevel.text, 30, 30, 580, 24);
    }
}

// ==========================
// Game Loop
// ==========================
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// ==========================
// Start Game
// ==========================
function startGame() {
    if (window.level1) {
        loadLevel(window.level1);
        gameLoop();
    } else {
        console.error("Level1.js not loaded!");
    }
}
