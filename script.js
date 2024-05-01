// Получение ссылки на холст и контекст отрисовки
var canvas = document.getElementById("arkanoidCanvas");
var ctx = canvas.getContext("2d");

// Переменные для платформы
var platformHeight = 10;
var platformWidth = 120; // Ширина платформы
var platformX = (canvas.width - platformWidth) / 2;

// Переменные для мяча
var ballRadius = 10;
var ballX = canvas.width / 2;
var ballY = canvas.height - 30; // Начальная позиция мяча выше
var dx = 4;
var dy = -4;

// Переменные для блоков
var blockRowCount = 10;
var blockColumnCount = 10;
var blockWidth = 60;
var blockHeight = 15;
var blockPadding = 16;
var blockOffsetTop = 28;
var blockOffsetLeft = 28;
var blocks = [];
var score = 0; // Переменная для подсчета баллов

// Цвета
var platformColor = "green";
var ballColor = "green";
var blockColor = "green";
var borderColor = "white"; // Цвет границ блоков, платформы и мяча

// Создание блоков
for (var c = 0; c < blockColumnCount; c++) {
    blocks[c] = [];
    for (var r = 0; r < blockRowCount; r++) {
        blocks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Функция отрисовки платформы
function drawPlatform() {
    ctx.beginPath();
    ctx.rect(platformX, canvas.height - platformHeight - 5, platformWidth, platformHeight); // Изменим позицию и размеры платформы
    ctx.fillStyle = platformColor;
    ctx.fill();
    ctx.strokeStyle = borderColor; // Установим цвет границы
    ctx.strokeRect(platformX, canvas.height - platformHeight - 5, platformWidth, platformHeight); // Нарисуем границу
    ctx.closePath();
}

// Функция отрисовки мяча
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.strokeStyle = borderColor; // Установим цвет границы
    ctx.stroke();
    ctx.closePath();
}

// Функция отрисовки блоков
function drawBlocks() {
    for (var c = 0; c < blockColumnCount; c++) {
        for (var r = 0; r < blockRowCount; r++) {
            if (blocks[c][r].status == 1) {
                var blockX = (r * (blockWidth + blockPadding)) + blockOffsetLeft;
                var blockY = (c * (blockHeight + blockPadding)) + blockOffsetTop;
                blocks[c][r].x = blockX;
                blocks[c][r].y = blockY;
                ctx.beginPath();
                ctx.rect(blockX, blockY, blockWidth, blockHeight);
                ctx.fillStyle = blockColor; // Изменим цвет блоков
                ctx.fill();
                ctx.strokeStyle = borderColor; // Установим цвет границы
                ctx.strokeRect(blockX, blockY, blockWidth, blockHeight); // Нарисуем границу
                ctx.closePath();
            }
        }
    }
}

// Функция отрисовки всего
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlatform();
    drawBall();
    drawBlocks();

    // Обработка столкновений и движение мяча
    ballX += dx;
    ballY += dy;

    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
    }
    if (ballY + dy < ballRadius) {
        dy = -dy;
    } else if (ballY + dy > canvas.height - ballRadius - platformHeight) {
        if (ballX > platformX && ballX < platformX + platformWidth) {
            dy = -dy;
        } else {
            // Конец игры
            alert("Неплохо! Твой счёт: " + score); // Выводим счет
            document.location.reload();
        }
    }

    // Проверка столкновения мяча с блоками
    collisionDetection();
}

// Функция обнаружения столкновения
function collisionDetection() {
    for (var c = 0; c < blockColumnCount; c++) {
        for (var r = 0; r < blockRowCount; r++) {
            var b = blocks[c][r];
            if (b.status == 1) {
                if (ballX > b.x && ballX < b.x + blockWidth && ballY > b.y && ballY < b.y + blockHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++; // Увеличиваем счёт при столкновении с блоком
                    if (score == blockRowCount * blockColumnCount) {
                        alert("Круто! Твой счёт: " + score); // Выводим счёт при победе
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Функция управления игрой по нажатию на клавиши
document.addEventListener("keydown", keyDownHandler, false);

// Переменная для отслеживания состояния игры
var isGamePaused = true;

// Обработчик нажатия клавиши
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        platformX += 50; // Увеличиваем позицию платформы на 50 пикселей вправо при нажатии на клавишу "Вправо" или стрелку "Вправо"
        if (platformX + platformWidth > canvas.width) {
            platformX = canvas.width - platformWidth; // Проверяем, чтобы платформа не выходила за пределы холста справа
        }
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        platformX -= 50; // Уменьшаем позицию платформы на 50 пикселей влево при нажатии на клавишу "Влево" или стрелку "Влево"
        if (platformX < 0) {
            platformX = 0; // Проверяем, чтобы платформа не выходила за пределы холста слева
        }
    } else if (e.key == " ") {
        // Пауза или старт игры при нажатии на пробел
        if (isGamePaused) {
            isGamePaused = false; // Игра не приостановлена
            gameLoop(); // Возобновляем игровой цикл
        } else {
            isGamePaused = true; // Игра приостановлена
        }
    }

}

// Основной игровой цикл
function gameLoop() {
    draw();
    if (!isGamePaused) {
        requestAnimationFrame(gameLoop);
    }
}

gameLoop(); // Запуск игрового цикла