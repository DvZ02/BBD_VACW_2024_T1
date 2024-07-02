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
const context = canvas.getContext('2d');
let size = 600;
canvas.width = size;
canvas.height = size;


class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.index = this.j+this.i*rows;
        this.inMaze = false;
    }
    show() {
        if (this.inMaze){
            context.fillStyle = '#1E1E1E';
            context.fillRect(this.i*cellSize, this.j*cellSize, cellSize, cellSize);
        } 
    }
}

class Wall {
    constructor(i1, j1, i2, j2) {
    this.i1 = i1;
    this.j1 = j1;
    this.i2 = i2;
    this.j2 = j2;
    if (i1-i2 == 0) {
        let y1 = cells[i1][j1].j*cellSize+cellSize/2;
        let y2 = cells[i2][j2].j*cellSize+cellSize/2;
        this.x1 = cells[i1][j1].i*cellSize;
        this.y1 = (y1+y2)/2;
        this.x2 = cells[i1][j1].i*cellSize+cellSize;
        this.y2 = this.y1;
    }
    else {
        let x1 = cells[i1][j1].i*cellSize+cellSize/2;
        let x2 = cells[i2][j2].i*cellSize+cellSize/2;
        this.x1 = (x1+x2)/2;
        this.y1 = cells[i1][j1].j*cellSize;
        this.x2 = this.x1;
        this.y2 = cells[i1][j1].j*cellSize+cellSize;
    }
    this.weight = Math.random();
    }
    show() {
        context.strokeStyle = "#12F496";
        context.beginPath();
        context.moveTo(this.x1, this.y1);
        context.lineTo(this.x2, this.y2);
        context.stroke();
    }
}

let cellSize = 50;
let cols = Math.ceil(canvas.width/cellSize);
let rows = Math.ceil(canvas.height/cellSize);
let cells = [];
let maze = [];
for (let i = 0; i < cols; i++) {
    maze[i] = [];
    for (let j = 0; j < rows; j++){
        maze[i][j] = 0;
    }
}
for (let i = 0; i < cols; i++) {
    cells[i] = [];
    for (let j = 0; j < rows; j++){
        cells[i][j] = new Cell(i, j);
    }
            
}

let walls = [];
let closed = [];
for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
        if (i < cols-1){
            walls.push(new Wall(i, j, i+1, j));
        } 
        if (j < rows-1){
            walls.push(new Wall(i, j, i, j+1)); 
        } 
    }
}

function generate() {
    context.lineCap = 'square';
    context.lineWidth = cellSize/4;
    while (true) {
        while (true) {
        let index;
        for (let i = 0; i < walls.length; i++){
            if (walls[index] == undefined || walls[i].weight < walls[index].weight){
                index = i;
            }
                
        } 
        let newIndex = cells[walls[index].i1][walls[index].j1].index;
        let oldIndex = cells[walls[index].i2][walls[index].j2].index;
        if (oldIndex != newIndex) {
            cells[walls[index].i1][walls[index].j1].inMaze = true;
            cells[walls[index].i2][walls[index].j2].inMaze = true;
            for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
                if (cells[i][j].index == oldIndex) {
                    cells[i][j].index = newIndex;
                }
            } 
            walls.splice(index, 1);
            break;
        } 
        else {
            closed.push(walls[index]);
            maze[Math.floor(index%11)][Math.floor(index/11)] = 1;
        } 
        walls.splice(index, 1);
        if (walls.length == 0) {
            break;
        }
            
        }
        if (walls.length == 0) { 
            break;
        }
            
    }
    
}

function draw(){
    for (let i = 0; i < cols; i++){
        for (let j = 0; j < rows; j++){
            cells[i][j].show();
        }
    }  
    for (let i = 0; i < walls.length; i++){
        if (cells[walls[i].i1][walls[i].j1].inMaze || cells[walls[i].i2][walls[i].j2].inMaze){
            walls[i].show();
            console.log(walls);
            
        }
    }  
    for (let i = 0; i < closed.length; i++){
        closed[i].show();
    }
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(cols*cellSize, 0);
    context.lineTo(cols*cellSize, rows*cellSize);
    context.lineTo(0, rows*cellSize);
    context.closePath();
    context.stroke();
}

generate();
draw();

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 1,  // Horizontal speed
    dy: 1   // Vertical speed
};

// Draw ball
function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = '#0095DD';
    context.fill();
    context.closePath();
}

function checkCollision() {

    let nextBallx = ball.x + ball.dx
    let nextBally = ball.y + ball.dy

    // [right, left, down, top]
    let pixels = [context.getImageData(nextBallx + ball.radius + 1, nextBally, 1, 1).data, context.getImageData(nextBallx - ball.radius - 1, nextBally, 1, 1).data, context.getImageData(nextBallx, nextBally + ball.radius + 1, 1, 1).data, context.getImageData(nextBallx, nextBally - ball.radius - 1, 1, 1).data];

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
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw();
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