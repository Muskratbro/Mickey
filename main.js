// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player (Mickey) setup
const player = {
    x: 50,
    y: 50,
    width: 32,
    height: 32,
    speed: 2,
    direction: "down",     // current movement direction
    frameIndex: 0,         // which frame of walking animation
    frameCounter: 0,       // counter to control frame change
    moving: false          // is player currently moving
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

// Load Mickey sprites (2 frames per direction)
const mickeySprites = {
    down: [new Image(), new Image()],
    up: [new Image(), new Image()],
    left: [new Image(), new Image()],
    right: [new Image(), new Image()]
};

// Assign frame sources (update with your actual file paths)
mickeySprites.down[0].src = "frame_003 (2).png";
mickeySprites.down[1].src = "assets/mickey/mickey_down_2.png";
mickeySprites.up[0].src = "assets/mickey/mickey_up_1.png";
mickeySprites.up[1].src = "assets/mickey/mickey_up_2.png";
mickeySprites.left[0].src = "assets/mickey/mickey_left_1.png";
mickeySprites.left[1].src = "assets/mickey/mickey_left_2.png";
mickeySprites.right[0].src = "assets/mickey/mickey_right_1.png";
mickeySprites.right[1].src = "assets/mickey/mickey_right_2.png";

// Load level function
function loadLevel(level) {
    currentLevel = level;
    player.x = level.startX;
    player.y = level.startY;
    player.frameIndex = 0;
    player.frameCounter = 0;
    player.moving = false;

    // Reset guard bullets & timers
    if (currentLevel.guards) {
        for (const guard of currentLevel.guards) {
            guard.timer = 0;
            guard.shootIndex = guard.shootIndex || 0;
            guard.bullets = [];
        }
    }

    // Update HTML text if any
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
    player.moving = false;

    // Movement input
    if (keys["ArrowUp"] || keys["w"]) { newY -= player.speed; player.direction = "up"; player.moving = true; }
    if (keys["ArrowDown"] || keys["s"]) { newY += player.speed; player.direction = "down"; player.moving = true; }
    if (keys["ArrowLeft"] || keys["a"]) { newX -= player.speed; player.direction = "left"; player.moving = true; }
    if (keys["ArrowRight"] || keys["d"]) { newX += player.speed; player.direction = "right"; player.moving = true; }

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
                if (isColliding(player, {x: bullet.x, y: bullet.y, width: bullet.size, height: bullet.size})) {
                    loadLevel(currentLevel);
                    return false;
                }
                return bullet.x > 0 && bullet.y > 0 && bullet.x < canvas.width && bullet.y < canvas.height;
            });
        }
    }

    // Bottom-of-screen level transition
    if (player.y + player.height >= canvas.height) {
        if (currentLevel.nextLevel) {
            loadLevel(currentLevel.nextLevel);
        } else {
            console.log("No next level defined!");
        }
    }

    // Walking animation (only animate if moving)
    if (player.moving) {
        player.frameCounter++;
        if (player.frameCounter >= 10) { // change frame every 10 updates
            player.frameIndex = (player.frameIndex + 1) % 2; // toggle between 2 frames
            player.frameCounter = 0;
        }
    } else {
        player.frameIndex = 0; // standing frame
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

    // Draw player (Mickey) using sprites
    const img = mickeySprites[player.direction][player.frameIndex];
    ctx.drawImage(img, player.x, player.y, player.width, player.height);
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
