// const container = document.getElementById('container');
// const canvas = container.querySelector("#canvas");
// const ctx = canvas.getContext('2d');
// const width = canvas.width;
// const height = canvas.height;
// const cellSize = 20;
// const cols = Math.floor(width / cellSize);
// const rows = Math.floor(height / cellSize);

// // Directions
// const directions = {
//     UP: { x: 0, y: -1 },
//     DOWN: { x: 0, y: 1 },
//     LEFT: { x: -1, y: 0 },
//     RIGHT: { x: 1, y: 0 }
// };

// // Initialize the grid
// let grid = [];
// for (let y = 0; y < rows; y++) {
//     let row = [];
//     for (let x = 0; x < cols; x++) {
//         row.push({ x: x, y: y, visited: false });
//     }
//     grid.push(row);
// }

// // Utility functions
// function getRandomDirection() {
//     const keys = Object.keys(directions);
//     return directions[keys[Math.floor(Math.random() * keys.length)]];
// }

// function isInRange(x, y) {
//     return x >= 0 && x < cols && y >= 0 && y < rows;
// }

// function drawCell(x, y) {
//     ctx.fillStyle = "#1E1E1E";
//     ctx.fillRect(x * cellSize, y * cellSize, cellSize-3, cellSize-3);
// }

// function drawLine(x1, y1, x2, y2) {
//     ctx.beginPath();
//     ctx.moveTo(x1, y1);
//     ctx.lineTo(x2, y2);
//     ctx.stroke();
// }

// function wilsonsAlgorithm() {
//     // visit random cell
//     let startX = Math.floor(Math.random() * cols);
//     let startY = Math.floor(Math.random() * rows);
//     grid[startY][startX].visited = true;
//     drawCell(startX, startY);

//     while (true) {
//         // find unvisited cell
//         let unvisitedCells = [];
//         for (let y = 0; y < rows; y++) {
//             for (let x = 0; x < cols; x++) {
//                 if (!grid[y][x].visited) {
//                     unvisitedCells.push(grid[y][x]);
//                 }
//             }
//         }
//         if (unvisitedCells.length === 0) break;

    
//         let randomCell = unvisitedCells[Math.floor(Math.random() * unvisitedCells.length)];
//         let path = [randomCell];
//         let currentCell = randomCell;
//         let pathMap = {};

//         //move randomly until hitting a visited cell
//         while (!currentCell.visited) {
//             let direction = getRandomDirection();
//             let nextX = currentCell.x + direction.x;
//             let nextY = currentCell.y + direction.y;

//             if (isInRange(nextX, nextY)) {
//                 currentCell = grid[nextY][nextX];
//                 let key = `${currentCell.x},${currentCell.y}`;
//                 if (pathMap[key]) {
//                     path = path.slice(0, pathMap[key] + 1);
//                 } else {
//                     pathMap[key] = path.length;
//                     path.push(currentCell);
//                 }
//             }
//         }

//         // draw the path
//         for (let i = 0; i < path.length; i++) {
//             let cell = path[i];
//             cell.visited = true;
//             drawCell(cell.x, cell.y);

//             if (i > 0) {
//                 let prevCell = path[i - 1];
//                 let midX = (cell.x + prevCell.x) * cellSize / 2 + cellSize / 2;
//                 let midY = (cell.y + prevCell.y) * cellSize / 2 + cellSize / 2;
//                 drawCell(midX / cellSize, midY / cellSize);
//             }
//         }
//     }
// }


// ctx.fillStyle = '#12F496';
// ctx.fillRect(0, 0, width, height);

// // Run Wilson's algorithm
// wilsonsAlgorithm();


const canvas = container.querySelector("#canvas");
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const BLACK = '#000000';
const GREEN = '#12F496';
const PLAYER_COLORS = ['#12F436', '#20CAFF', '#FB8F10', '#DE13C9'];

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    dx: 1,  // Horizontal speed
    dy: 1   // Vertical speed
};

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

const walls = [
    { x: 200, y: 100, width: 400, height: 20 },
    { x: 200, y: 400, width: 400, height: 20 },
    { x: 100, y: 200, width: 20, height: 200 },
    { x: 680, y: 200, width: 20, height: 200 }
];

function drawWalls() {
    ctx.fillStyle = '#12F496';
    walls.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
}

function checkCollision() {

    let nextBallx = ball.x + ball.dx
    let nextBally = ball.y + ball.dy

    // [right, left, down, top]
    let pixels = [ctx.getImageData(nextBallx + ball.radius + 1, nextBally, 1, 1).data, ctx.getImageData(nextBallx - ball.radius - 1, nextBally, 1, 1).data, ctx.getImageData(nextBallx, nextBally + ball.radius + 1, 1, 1).data, ctx.getImageData(nextBallx, nextBally - ball.radius - 1, 1, 1).data];

    if(pixels[0][0] == 18 || pixels[1][0] == 18 )
    {
        ball.dx *= -1;
    }
    if(pixels[2][0] == 18 || pixels[3][0] == 18)
    {
        ball.dy *= -1;
    }
}

// Update ball position
function updateBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls();
    drawBall();

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Check for collision with walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    checkCollision();
}

function adjustSpeed(axis, increase) {
    if (axis === 'x') {
        if (increase) {
            ball.dx = (ball.dx > 0 ? 1 : -1) * (Math.abs(ball.dx) + 1);
        } else {
            ball.dx = (ball.dx > 0 ? 1 : -1) * Math.max(1, Math.abs(ball.dx) - 1);
        }
    } else if (axis === 'y') {
        if (increase) {
            ball.dy = (ball.dy > 0 ? 1 : -1) * (Math.abs(ball.dy) + 1);
        } else {
            ball.dy = (ball.dy > 0 ? 1 : -1) * Math.max(1, Math.abs(ball.dy) - 1);
        }
    }
}

function rgbToHex(pixelData) {
    let r = pixelData[0];
    let g = pixelData[1];
    let b = pixelData[2];

    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 24) | (g << 16) | b << 8).toString(16);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    updateBall();
}

// Start animation
animate();

document.getElementById('increaseSpeedX').addEventListener('click', () => adjustSpeed('x', true));
document.getElementById('decreaseSpeedX').addEventListener('click', () => adjustSpeed('x', false));
document.getElementById('increaseSpeedY').addEventListener('click', () => adjustSpeed('y', true));
document.getElementById('decreaseSpeedY').addEventListener('click', () => adjustSpeed('y', false));

