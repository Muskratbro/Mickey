window.level3 = {
    startX: 40,
    startY: 40,

    // Maze-like walls
    walls: [
        // Borders
        { x: 0, y: 0, width: 640, height: 20 },
        { x: 0, y: 0, width: 20, height: 480 },
        { x: 620, y: 0, width: 20, height: 480 },
        { x: 0, y: 460, width: 640, height: 20 },

        // Maze interior
        { x: 60, y: 60, width: 500, height: 20 },
        { x: 60, y: 60, width: 20, height: 200 },
        { x: 140, y: 120, width: 360, height: 20 },
        { x: 480, y: 120, width: 20, height: 260 },
        { x: 200, y: 200, width: 20, height: 180 },
        { x: 200, y: 380, width: 300, height: 20 }
    ],

    // Stationary guards
    guards: [
        { x: 120, y: 100, shootIndex: 0, timer: 0, bullets: [] },
        { x: 360, y: 180, shootIndex: 0, timer: 0, bullets: [] }
    ],

    // Level text
    text: "The city is watched. Avoid the guards' bullets.",

    nextLevel: null
};
