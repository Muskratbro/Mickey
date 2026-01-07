// Level 1 definition
window.level1 = {
    startX: 50,
    startY: 50,
    walls: [
        // Outer walls
        {x: 0, y: 0, width: 640, height: 20},       // top wall
        {x: 0, y: 0, width: 20, height: 480},       // left wall
        {x: 620, y: 0, width: 20, height: 480},     // right wall
        // Inner obstacles
        {x: 100, y: 100, width: 150, height: 20},   // horizontal top obstacle
        {x: 250, y: 200, width: 20, height: 150},   // vertical middle obstacle
        {x: 150, y: 350, width: 300, height: 20}    // horizontal bottom obstacle
    ],
    nextLevel: null // will be automatically linked in index.html
};
