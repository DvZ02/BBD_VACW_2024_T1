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
});

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
    dx: 0,  // Horizontal speed
    dy: 0,   // Vertical speed
    ax: 0,
    ay: 0
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

