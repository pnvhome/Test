const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Определяем размеры объектов
const paddleWidth = canvas.width / 8;  // Пэддл теперь 1/8 ширины экрана
const paddleHeight = 15;
const ballRadius = 15;  // Уменьшим радиус мяча

// Позиции пэддла и мяча
let paddleX = (canvas.width - paddleWidth) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height - 50;
let ballSpeedX = 4;  // Скорость также немного уменьшена для удобства игры
let ballSpeedY = -4;

// Графические ресурсы
const bitcoinImg = new Image();
bitcoinImg.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png'; // URL значка биткоина

// Блоки
const rowCount = 3;  // Количество строк блоков
const columnCount = Math.floor(canvas.width / 100);  // Количество колонок блока остается адаптивным
const blockWidth = (canvas.width - (columnCount - 1) * 10) / columnCount; // Подгоняем ширину блока
const blockHeight = blockWidth / 2; // Делаем блоки более прямоугольными, с меньшей высотой
const blockPadding = 10;
const blockOffsetTop = canvas.height / 10; // Начнем рисовать блоки немного ниже
const blockOffsetLeft = (canvas.width - (columnCount * blockWidth + (columnCount - 1) * blockPadding)) / 2;
let blocks = [];

// Счет и жизни игрока
let score = 0;
let lives = 3;

// Массив цветов для блоков
const blockColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFDD33'];

// Заполнение массива блоков
for(let c = 0; c < columnCount; c++) {
    blocks[c] = [];
    for(let r = 0; r < rowCount; r++) {
        blocks[c][r] = {
            x: 0,
            y: 0,
            status: 1,
            color: blockColors[Math.floor(Math.random() * blockColors.length)] // Случайный цвет блока
        };
    }
}

// Функция для рисования прямоугольников со скругленными углами
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

// Рисуем блоки
function drawBlocks() {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    for(let c = 0; c < columnCount; c++) {
        for(let r = 0; r < rowCount; r++) {
            if(blocks[c][r].status == 1) {
                let blockX = (c * (blockWidth + blockPadding)) + blockOffsetLeft;
                let blockY = (r * (blockHeight + blockPadding)) + blockOffsetTop;
                blocks[c][r].x = blockX;
                blocks[c][r].y = blockY;

                // Рисуем блок со скругленными углами
                ctx.fillStyle = blocks[c][r].color;
                drawRoundedRect(ctx, blockX, blockY, blockWidth, blockHeight, 10);
                ctx.fill();
            }
        }
    }
    
    // Отключаем тени после рисования блоков, чтобы они не применялись к другим элементам
    ctx.shadowColor = 'transparent';
}

// Рисуем пэддл
function drawPaddle() {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    ctx.beginPath();
    drawRoundedRect(ctx, paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight, 10);
    ctx.fillStyle = '#0095DD';
    ctx.fill();

    // Отключаем тени после рисования пэддла
    ctx.shadowColor = 'transparent';
}

// Рисуем мяч
function drawBall() {
    ctx.drawImage(bitcoinImg, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);
}

// Отображаем счет и жизни
function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Score: ' + score, 8, 20);
    ctx.fillText('Lives: ' + lives, canvas.width - 80, 20);
}

// Обработка столкновения мяча с блоками
function collisionDetection() {
    for(let c = 0; c < columnCount; c++) {
        for(let r = 0; r < rowCount; r++) {
            let b = blocks[c][r];
            if(b.status == 1) {
                if(ballX > b.x && ballX < b.x + blockWidth && ballY > b.y && ballY < b.y + blockHeight) {
                    ballSpeedY = -ballSpeedY;
                    b.status = 0;
                    score++;
                    if(score == rowCount * columnCount) {
                        alert('You win!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Обновление положения мяча и пэддла
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBlocks();
    drawPaddle();
    drawBall();
    drawScore();
    collisionDetection();

    // Движение мяча
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Отражение мяча от стен
    if(ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }
    if(ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    } else if(ballY + ballRadius > canvas.height - paddleHeight) {
        if(ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
            ballSpeedX += Math.random() * 2 - 1; // Увеличение скорости по X при каждом отражении
            ballSpeedY *= 1.05; // Ускорение мяча по Y
        } else if (ballY + ballRadius > canvas.height) {  // Если мяч упал за границу поля
            lives--;
            if(lives === 0) {
                alert('You DIE Looser');
                document.location.reload();
            } else {
                resetBall();
            }
        }
    }

    // Движение пэддла
    if(isTouching) {
        paddleX = touchX - paddleWidth / 2;
    }

    requestAnimationFrame(update);
}

// Обработка касаний
let isTouching = false;
let touchX = 0;

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
    paddleX = (canvas.width - paddleWidth) / 2;
    resetBall();
});

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 50;
    ballSpeedX = 4;
    ballSpeedY = -4;
}

update();