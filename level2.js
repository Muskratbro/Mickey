// Level 2 definition
window.level2 = {
    startX: 50,
    startY: 50,  // player starts near top
    walls: [
        // Outer walls
        {x: 0, y: 0, width: 640, height: 20},       // top wall
        {x: 0, y: 0, width: 20, height: 480},       // left wall
        {x: 620, y: 0, width: 20, height: 480},     // right wall
        // Inner obstacles
        {x: 100, y: 150, width: 400, height: 20},   // horizontal top obstacle
        {x: 200, y: 250, width: 20, height: 150},   // vertical middle obstacle
        {x: 150, y: 380, width: 350, height: 20}    // horizontal bottom obstacle
    ],
    text: "You try not to think about what happened yesterday... too painfull. But it is impossible to resist. Donald Is dead. and its all my fault."
    nextLevel: null // will be automatically linked in index.html
};
