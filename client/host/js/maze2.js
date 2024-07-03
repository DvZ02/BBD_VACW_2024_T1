const socket = new io('https://tilt-3596.onrender.com');
// const socket = new io('http://localhost:8000');

let globalX = 0;
let globalY = 0;

socket.emit("RequestPlayers");

socket.on("PlayingPlayers", (players) => {
    let playersList = JSON.parse(players);
    const playerTable = document.getElementById("players");

    playersList.players.forEach(player => {
        const row = document.createElement("tr");
        const username = document.createElement("td");
        const score = document.createElement("td");
        const contribution = document.createElement("td");

        username.innerHTML = player.playerUsername;
        score.innerHTML = player.score;
        contribution.innerHTML = player.contribution;

        let color;
        switch(player.color){
            case "pink":
                color = "#DE13C9";
                break;
            case "blue":
                color = "#20CAFF";
                break;
            case "green":
                color = "#12F436";
                break;
            case "orange":
                color = "#FB8F10";
                break;
        };
        row.style.color = color;
        row.appendChild(username);
        row.appendChild(score);
        row.appendChild(contribution);
        playerTable.appendChild(row);
    });
});

socket.on("MoveBall", (data) => {
    globalX = data.x;
    globalY = data.y;
    console.log(data);
});

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
    radius: 20,
    dx: 0,  // Horizontal speed
    dy: 0,   // Vertical speed
    ax: 0,
    ay: 0
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

    let nextBallx = ball.x + (ball.dx / 1000);
    let nextBally = ball.y + (ball.dy / 1000);

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
    ball.x += ball.dx / 1000;
    ball.y += ball.dy / 1000;

    // Check for collision with walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    checkCollision();
    adjustSpeed();
}

function adjustSpeed() {
    ball.dx = (ball.dx > 0 ? 1 : -1) * (Math.abs(ball.dx) + globalX);
    ball.dy = (ball.dy > 0 ? 1 : -1) * (Math.abs(ball.dy) + globalY);
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

// document.getElementById('increaseSpeedX').addEventListener('click', () => adjustSpeed('x', true));
// document.getElementById('decreaseSpeedX').addEventListener('click', () => adjustSpeed('x', false));
// document.getElementById('increaseSpeedY').addEventListener('click', () => adjustSpeed('y', true));
// document.getElementById('decreaseSpeedY').addEventListener('click', () => adjustSpeed('y', false));
