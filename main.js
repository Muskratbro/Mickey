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

// Simple map (walls as rectangles)
const walls = [
    {x: 0, y: 0, width: 640, height: 20},       // top wall
    {x: 0, y: 460, width: 640, height: 20},     // bottom wall
    {x: 0, y: 0, width: 20, height: 480},       // left wall
    {x: 620, y: 0, width: 20, height: 480},     // right wall
    {x: 200, y: 100, width: 200, height: 20},   // inner obstacle
    {x: 100, y: 250, width: 20, height: 150}    // another obstacle
];

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
    for (const wall of walls) {
        if (isColliding(tempPlayer, wall)) {
            collision = true;
            break;
        }
    }

    if (!collision) {
        player.x = newX;
        player.y = newY;
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw walls
    ctx.fillStyle = "#333";
    for (const wall of walls) {
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

// Start the game
gameLoop();

