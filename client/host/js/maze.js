let mazeData = [
    ['c', 1, 1, 1, 0, 0, 0, 0, 'd'],
    [0, 1, 0, 0, 0, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 1, 1, 1, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 1, 1, 1, 0, 0, 1, 0, 0],
    ['a', 0, 0, 0, 0, 1, 1, 1, 'b']
];

let playerColors = {
    'a': "#12F436",
    'b': "#20CAFF",
    'c': "#FB8F10",
    'd': "#DE13C9"
};

const container = document.getElementById('container');
const canvas = container.querySelector("#canvas");

const ctx = canvas.getContext('2d');
const canvasSize = 500;
const blockSize = (canvasSize / mazeData.length);

function setCanvasSize(size) {
    canvas.width = size;
    canvas.height = size;
}

function draw() {
    for (let i = 0; i < mazeData.length; i++) {
        for (let j = 0; j < mazeData[i].length; j++) {
            if (mazeData[i][j] === 1) {
                ctx.fillStyle = '#12F496';
                ctx.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
            } else if (typeof mazeData[i][j] !== "number") {
                drawCircle(ctx, j * blockSize + blockSize / 2, i * blockSize + blockSize / 2, blockSize / 2, playerColors[mazeData[i][j]]);
            }
        }
    }
    drawCircle(ctx, canvasSize / 2, canvasSize / 2, blockSize * 0.4, "white");
}

function drawCircle(context, x, y, radius, color) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = color;
    context.fill();
    context.stroke();
}

setCanvasSize(canvasSize);
draw();
