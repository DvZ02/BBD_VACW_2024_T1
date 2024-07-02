const container = document.getElementById('container');
const canvas = container.querySelector("#canvas");
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const cellSize = 20;
const cols = Math.floor(width / cellSize);
const rows = Math.floor(height / cellSize);

// Directions
const directions = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

// Initialize the grid
let grid = [];
for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < cols; x++) {
        row.push({ x: x, y: y, visited: false });
    }
    grid.push(row);
}

// Utility functions
function getRandomDirection() {
    const keys = Object.keys(directions);
    return directions[keys[Math.floor(Math.random() * keys.length)]];
}

function isInRange(x, y) {
    return x >= 0 && x < cols && y >= 0 && y < rows;
}

function drawCell(x, y) {
    ctx.fillStyle = "#1E1E1E";
    ctx.fillRect(x * cellSize, y * cellSize, cellSize-3, cellSize-3);
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function wilsonsAlgorithm() {
    // visit random cell
    let startX = Math.floor(Math.random() * cols);
    let startY = Math.floor(Math.random() * rows);
    grid[startY][startX].visited = true;
    drawCell(startX, startY);

    while (true) {
        // find unvisited cell
        let unvisitedCells = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (!grid[y][x].visited) {
                    unvisitedCells.push(grid[y][x]);
                }
            }
        }
        if (unvisitedCells.length === 0) break;

    
        let randomCell = unvisitedCells[Math.floor(Math.random() * unvisitedCells.length)];
        let path = [randomCell];
        let currentCell = randomCell;
        let pathMap = {};

        //move randomly until hitting a visited cell
        while (!currentCell.visited) {
            let direction = getRandomDirection();
            let nextX = currentCell.x + direction.x;
            let nextY = currentCell.y + direction.y;

            if (isInRange(nextX, nextY)) {
                currentCell = grid[nextY][nextX];
                let key = `${currentCell.x},${currentCell.y}`;
                if (pathMap[key]) {
                    path = path.slice(0, pathMap[key] + 1);
                } else {
                    pathMap[key] = path.length;
                    path.push(currentCell);
                }
            }
        }

        // draw the path
        for (let i = 0; i < path.length; i++) {
            let cell = path[i];
            cell.visited = true;
            drawCell(cell.x, cell.y);

            if (i > 0) {
                let prevCell = path[i - 1];
                let midX = (cell.x + prevCell.x) * cellSize / 2 + cellSize / 2;
                let midY = (cell.y + prevCell.y) * cellSize / 2 + cellSize / 2;
                drawCell(midX / cellSize, midY / cellSize);
            }
        }
    }
}


ctx.fillStyle = '#12F496';
ctx.fillRect(0, 0, width, height);

// Run Wilson's algorithm
wilsonsAlgorithm();