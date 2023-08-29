let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * columns / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;

let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
};

let shipImg;
let shipVelocityX = tileSize;

let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;
let alienVelocityX = 1;

let bulletArray = [];
let bulletVelocityY = -10;

let score = 0;
let gameOver = false;
let playerName = "";

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    shipImg = new Image();
    shipImg.src = "ship.png";
    shipImg.onload = function() {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    };

    alienImg = new Image();
    alienImg.src = "alien-magenta.png";

    createAliens();

    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);

    showStartScreen();
};

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        showGameOverScreen();
        return;
    }

    if (score >= 60000) {
        showVictoryScreen();
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX * 2;

                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

            if (alien.y >= ship.y) {
                gameOver = true;
            }
        }
    }

    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }
    }

    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift();
    }

    if (alienCount == 0) {
        score += alienColumns * alienRows * 100;
        alienColumns = Math.min(alienColumns + 1, columns / 2 - 2);
        alienRows = Math.min(alienRows + 1, rows - 4);
        if (alienVelocityX > 0) {
            alienVelocityX += 0.2;
        } else {
            alienVelocityX -= 0.2;
        }
        alienArray = [];
        bulletArray = [];
        createAliens();
    }

    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score, 5, 20);
}

function moveShip(e) {
    if (gameOver) {
        return;
    }

    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX;
    } else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX;
    }
}

function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img: alienImg,
                x: alienX + c * alienWidth,
                y: alienY + r * alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive: true
            };
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e) {
    if (gameOver) {
        return;
    }

    if (e.code == "KeyW") {
        let bullet = {
            x: ship.x + shipWidth * 15 / 32,
            y: ship.y,
            width: tileSize / 8,
            height: tileSize / 2,
            used: false
        };
        bulletArray.push(bullet);
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function showStartScreen() {
    let startScreen = document.getElementById("start-screen");
    startScreen.style.display = "block";
}



function startGame() {
    playerName = document.getElementById("playerName").value;
    hideStartScreen();
    requestAnimationFrame(update);
}

function hideStartScreen() {
    let startScreen = document.getElementById("start-screen");
    startScreen.style.display = "none";
}

let startGameButton = document.getElementById("start-game-button");
startGameButton.addEventListener("click", startGame);

let playerNameInput = document.getElementById("playerName");


    function restartGame() {
        location.reload();
    }


function showVictoryScreen() {
    let victoryScreen = document.getElementById("victory-screen");
    let victoryScore = document.getElementById("victory-score");


    victoryScore.textContent = "Score: " + score;

    victoryScreen.style.display = "block";

    let victoryRestartButton = document.getElementById("victory-restart-button");
    victoryRestartButton.addEventListener("click", restartGame);
}
function showGameOverScreen() {
    let gameOverScreen = document.getElementById("game-over-screen");
    let gameOverMessage = document.getElementById("game-over-message");
    let gameOverName = document.getElementById("game-over-name");
    let gameOverScore = document.getElementById("game-over-score");

    gameOverMessage.textContent = "Game Over!";
    gameOverName.textContent = "Player: " + playerName;
    gameOverScore.textContent = "Score: " + score;

    gameOverScreen.style.display = "block";
    let restartButton = document.getElementById("game-over-restart-button");
    restartButton.addEventListener("click", restartGame);
}
let serialPort;

async function initSerial() {
    try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        serialPort = port;
        readLoop();
    } catch (error) {
        console.error(error);
    }
}

async function readLoop() {
    const decoder = new TextDecoderStream();
    const readableStreamClosed = serialPort.readable.pipeTo(decoder.writable);
    const reader = decoder.readable.getReader();

    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                break;
            }
            processData(value);
        }
    } catch (error) {
        console.error(error);
    } finally {
        reader.releaseLock();
    }
}

function processData(data) {
    // Parse data received from Arduino
    const [dataType, values] = data.trim().split(':');

    if (dataType === 'Joystick') {
        const [xValue, yValue] = values.split(',');
        // Use xValue and yValue for game movement
    } else if (dataType === 'ButtonPressed') {
        // Perform actions for button press
    }
}

// ... your existing code ...

document.addEventListener('DOMContentLoaded', () => {
    initSerial();
});

