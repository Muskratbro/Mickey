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

// Load level function
function loadLevel(level) {
    currentLevel = level;
    player.x = level.startX;
    player.y = level.startY;

    // Update HTML text
    const levelText = document.getElementById("levelText");
    if (levelText && level.text) {
        levelText.innerText = level.text;
    }
}

// Key state
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// Collision detection
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update player movement
function update() {
    let newX = player.x;
    let newY = player.y;

    if (keys["ArrowUp"] || keys["w"]) newY -= player.speed;
    if (keys["ArrowDown"] || keys["s"]) newY += player.speed;
    if (keys["ArrowLeft"] || keys["a"]) newX -= player.speed;
    if (keys["ArrowRight"] || keys["d"]) newX += player.speed;

    // Check collisions
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

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw walls
    ctx.fillStyle = "#333";
    for (const wall of currentLevel.walls) {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }

    // Draw player (Mickey as red block)
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game after levels are loaded
function startGame() {
    if (window.level1) {
        loadLevel(window.level1);
        gameLoop();
    } else {
        console.error("Level1.js not loaded!");
    }
}
