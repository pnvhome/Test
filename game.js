const matrixCanvas = document.getElementById('matrixCanvas');
const matrixCtx = matrixCanvas.getContext('2d');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

matrixCanvas.width = gameCanvas.width = window.innerWidth;
matrixCanvas.height = gameCanvas.height = window.innerHeight;

const matrixColumns = Math.floor(matrixCanvas.width / 20);
const matrixDrops = [];
const matrixSymbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()*&^%';
for (let x = 0; x < matrixColumns; x++) {
    matrixDrops[x] = Math.random() * matrixCanvas.height;
}

function drawMatrix() {
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    
    matrixCtx.fillStyle = 'rgba(0, 255, 0, 0.7)';
    matrixCtx.font = '15px monospace';

    for (let i = 0; i < matrixDrops.length; i++) {
        const text = matrixSymbols.charAt(Math.floor(Math.random() * matrixSymbols.length));
        matrixCtx.fillText(text, i * 20, matrixDrops[i]);

        if (matrixDrops[i] > matrixCanvas.height && Math.random() > 0.975) {
            matrixDrops[i] = 0;
        }

        matrixDrops[i] += 20;
    }
}

const paddleWidth = gameCanvas.width / 5;
const paddleHeight = 15;
const ballRadius = gameCanvas.width / 30;

let paddleX = (gameCanvas.width - paddleWidth) / 2;
let ballX = gameCanvas.width / 2;
let ballY = gameCanvas.height - 60;
let ballSpeedX = 4;
let ballSpeedY = -4;

const bitcoinImg = new Image();
bitcoinImg.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png';

const rowCount = 6;
const blockWidth = Math.floor(gameCanvas.width / 8);
const blockHeight = blockWidth;
const columnCount = Math.floor(gameCanvas.width / (blockWidth + 10));
const blockPadding = 10;
const blockOffsetTop = gameCanvas.height / 12;
const blockOffsetLeft = (gameCanvas.width - (columnCount * (blockWidth + blockPadding))) / 2;
let blocks = [];

let score = 0;
let lives = 3;

const blockColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFDD33'];

for (let c = 0; c < columnCount; c++) {
    blocks[c] = [];
    for (let r = 0; r < rowCount; r++) {
        blocks[c][r] = {
            x: 0,
            y: 0,
            status: 1,
            color: blockColors[Math.floor(Math.random() * blockColors.length)]
        };
    }
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function drawBlocks() {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    for (let c = 0; c < columnCount; c++) {
        for (let r = 0; r < rowCount; r++) {
            if (blocks[c][r].status === 1) {
                let blockX = (c * (blockWidth + blockPadding)) + blockOffsetLeft;
                let blockY = (r * (blockHeight + blockPadding)) + blockOffsetTop;
                blocks[c][r].x = blockX;
                blocks[c][r].y = blockY;

                ctx.fillStyle = blocks[c][r].color;
                drawRoundedRect(ctx, blockX, blockY, blockWidth, blockHeight, 8);
                ctx.fill();
            }
        }
    }

    ctx.shadowColor = 'transparent';
}

function drawPaddle() {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    ctx.beginPath();
    drawRoundedRect(ctx, paddleX, gameCanvas.height - paddleHeight, paddleWidth, paddleHeight, 8);
    ctx.fillStyle = '#0095DD';
    ctx.fill();

    ctx.shadowColor = 'transparent';
}

function drawBall() {
    ctx.drawImage(bitcoinImg, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Score: ' + score, 8, 20);
    ctx.fillText('Lives: ' + lives, gameCanvas.width - 80, 20);
}

function collisionDetection() {
    for (let c = 0; c < columnCount; c++) {
        for (let r = 0; r < rowCount; r++) {
            let b = blocks[c][r];
            if (b.status === 1) {
                if (ballX > b.x && ballX < b.x + blockWidth && ballY > b.y && ballY < b.y + blockHeight) {
                    ballSpeedY = -ballSpeedY;
                    b.status = 0;
                    score++;
                    if (score === rowCount * columnCount) {
                        alert('You win!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function update() {
    drawMatrix();
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawBlocks();
    drawPaddle();
    drawBall();
    drawScore();
    collisionDetection();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX + ballRadius > gameCanvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballRadius > gameCanvas.height - paddleHeight) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
            ballSpeedX += Math.random() * 2 - 1;
            ballSpeedY *= 1.05;
        } else if (ballY + ballRadius > gameCanvas.height) {
            lives--;
            if (lives === 0) {
                alert('Game Over');
                document.location.reload();
            } else {
                resetBall();
            }
        }
    }

    if (isTouching) {
        paddleX = touchX - paddleWidth / 2;
    }

    requestAnimationFrame(update);
}

let isTouching = false;
let touchX = 0;

gameCanvas.addEventListener('touchstart', function (event) {
    isTouching = true;
    touchX = event.touches[0].clientX;
});

gameCanvas.addEventListener('touchmove', function (event) {
    touchX = event.touches[0].clientX;
});

gameCanvas.addEventListener('touchend', function () {
    isTouching = false;
});

window.addEventListener('resize', function () {
    gameCanvas.width = matrixCanvas.width = window.innerWidth;
    gameCanvas.height = matrixCanvas.height = window.innerHeight;
    paddleX = (gameCanvas.width - paddleWidth) / 2;
    resetBall();
});

function resetBall() {
    ballX = gameCanvas.width / 2;
    ballY = gameCanvas.height - 50;
    ballSpeedX = 4;
    ballSpeedY = -4;
}

update();