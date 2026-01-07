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

// Guard shooting directions (UP → RIGHT → DOWN → LEFT)
const guardDirections = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
];

// Current level
let currentLevel = null;

// Load level function
function loadLevel(level) {
    currentLevel = level;
    player.x = level.startX;
    player.y = level.startY;

    // Reset guard bullets & timers
    if (currentLevel.guards) {
        for (const guard of currentLevel.guards) {
            guard.timer = 0;
            guard.shootIndex = guard.shootIndex || 0;
            guard.bullets = [];
        }
    }

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

// Update player + guards
function update() {
    let newX = player.x;
    let newY = player.y;

    if (keys["ArrowUp"] || keys["w"]) newY -= player.speed;
    if (keys["ArrowDown"] || keys["s"]) newY += player.speed;
    if (keys["ArrowLeft"] || keys["a"]) newX -= player.speed;
    if (keys["ArrowRight"] || keys["d"]) newX += player.speed;

    // Wall collision
    const tempPlayer = { ...player, x: newX, y: newY };
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

    // Guard logic (stationary)
    if (currentLevel.guards) {
        for (const guard of currentLevel.guards) {
            guard.timer++;

            // Fire every 60 frames
            if (guard.timer >= 60) {
                guard.timer = 0;

                const dir = guardDirections[guard.shootIndex];
                guard.shootIndex = (guard.shootIndex + 1) % 4;

                guard.bullets.push({
                    x: guard.x + 16,
                    y: guard.y + 16,
                    vx: dir.x * 3,
                    vy: dir.y * 3,
                    size: 6
                });
            }

            // Update bullets
            guard.bullets = guard.bullets.filter(bullet => {
                bullet.x += bullet.vx;
                bullet.y += bullet.vy;

                // Bullet hits player → reset level
                if (isColliding(player, {
                    x: bullet.x,
                    y: bullet.y,
                    width: bullet.size,
                    height: bullet.size
                })) {
                    loadLevel(currentLevel);
                    return false;
                }

                // Remove off-screen bullets
                return (
                    bullet.x > 0 &&
                    bullet.y > 0 &&
                    bullet.x < canvas.width &&
                    bullet.y < canvas.height
                );
            });
        }
    }

    // Bottom-of-screen level transition (instant, no flash)
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

    // Draw guards
    if (currentLevel.guards) {
        for (const guard of currentLevel.guards) {
            ctx.fillStyle = "blue";
            ctx.fillRect(guard.x, guard.y, 32, 32);

            ctx.fillStyle = "yellow";
            for (const bullet of guard.bullets) {
                ctx.fillRect(bullet.x, bullet.y, bullet.size, bullet.size);
            }
        }
    }

    // Draw player (Mickey)
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    if (window.level1) {
        loadLevel(window.level1);
        gameLoop();
    } else {
        console.error("Level1.js not loaded! lol");
    }
}
