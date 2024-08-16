const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paddleWidth = 150;
const paddleHeight = 20;
const ballRadius = 15;

let playerX = (canvas.width - paddleWidth) / 2;
let computerX = (canvas.width - paddleWidth) / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

let playerScore = 0;
let computerScore = 0;

// Переменные для хранения данных касания
let isTouching = false;
let touchX = 0;

function drawPaddle(x, y) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0';
    ctx.fill();
    ctx.closePath();
}

function drawScores() {
    ctx.font = '30px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Player: ${playerScore}`, 20, 30);
    ctx.fillText(`Computer: ${computerScore}`, canvas.width - 200, 30);
}

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Отражение от боковых стен
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }

    // Отражение от платформ
    if (ballY + ballRadius > canvas.height - paddleHeight && ballX > playerX && ballX < playerX + paddleWidth) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY - ballRadius < paddleHeight && ballX > computerX && ballX < computerX + paddleWidth) {
        ballSpeedY = -ballSpeedY;
    }

    // Обработка попадания в верхнюю и нижнюю границы
    if (ballY + ballRadius > canvas.height) {
        computerScore++;
        resetBall();
    } else if (ballY - ballRadius < 0) {
        playerScore++;
        resetBall();
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 5;
}

function computerAI() {
    if (computerX + paddleWidth / 2 < ballX) {
        computerX += 4;
    } else {
        computerX -= 4;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawPaddle(playerX, canvas.height - paddleHeight);
    drawPaddle(computerX, 0);
    drawBall();
    drawScores();
    
    updateBall();
    computerAI();
    
    if (isTouching) {
        playerX = touchX - paddleWidth / 2;
    }

    requestAnimationFrame(gameLoop);
}

// Обработка касаний
canvas.addEventListener('touchstart', function(event) {
    isTouching = true;
    touchX = event.touches[0].clientX;
});

canvas.addEventListener('touchmove', function(event) {
    touchX = event.touches[0].clientX;
});

canvas.addEventListener('touchend', function() {
    isTouching = false;
});

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    playerX = (canvas.width - paddleWidth) / 2;
    computerX = (canvas.width - paddleWidth) / 2;
    resetBall();
});

gameLoop();