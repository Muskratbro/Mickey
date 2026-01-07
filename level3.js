window.level3 = {
    startX: 30, // safe spawn, completely clear
    startY: 30,

    // Maze walls
    walls: [
        // Outer boundaries (top, left, right) — no bottom wall!
        { x: 0, y: 0, width: 640, height: 20 },   // top
        { x: 0, y: 0, width: 20, height: 480 },   // left
        { x: 620, y: 0, width: 20, height: 480 }, // right

        // Inner maze walls
        { x: 60, y: 60, width: 200, height: 20 },
        { x: 60, y: 60, width: 20, height: 200 },
        { x: 240, y: 60, width: 20, height: 180 },
        { x: 120, y: 180, width: 140, height: 20 },
        { x: 400, y: 60, width: 20, height: 200 },
        { x: 320, y: 180, width: 80, height: 20 },
        { x: 500, y: 180, width: 20, height: 200 },
        { x: 200, y: 300, width: 220, height: 20 }
    ],

    // Guards (stationary blue blocks with bullets)
    guards: [
        { x: 100, y: 100, shootIndex: 0, timer: 0, bullets: [] },
        { x: 400, y: 100, shootIndex: 0, timer: 0, bullets: [] },
        { x: 300, y: 250, shootIndex: 0, timer: 0, bullets: [] }
    ],

    text: "Level 3: The city guards are here. Avoid their bullets!",

    nextLevel: null
};
