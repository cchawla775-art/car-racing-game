const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');

let player = {
    speed: 5,
    score: 0,
    start: false
};

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Shift: false
};
let highScore = localStorage.getItem("highScore") || 0;

let level = 1;
let lastLevelScore = 0;
let coins = 0;
let lives = 3;
let isNight = false;
let lastThemeScore = 0;

let moveSpeed = 7;
let nitro = false;
let selectedSpeed = 5;



document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e) {
    keys[e.key] = true;
}

function keyUp(e) {
    keys[e.key] = false;
}
document.getElementById("startBtn")
    .addEventListener("click", start);
// startScreen.addEventListener('click', start);


function start() {

    startScreen.classList.add('hide');
    gameArea.innerHTML = "";

    player.start = true;
    player.score = 0;
    let speedBox = document.getElementById("speedSelect");

    player.speed = speedBox
        ? Number(speedBox.value)
        : 5;
    selectedSpeed = player.speed;

    level = 1;
    lastLevelScore = 0;
    coins = 0;
    lastThemeScore = 0;
    isNight = false;
    lives = 3;
    for (let x = 0; x < 5; x++) {
        let roadLine = document.createElement('div');
        roadLine.classList.add('line');
        roadLine.y = (x * 150);
        roadLine.style.top = roadLine.y + "px";
        gameArea.appendChild(roadLine);
    }

    let car = document.createElement('div');
    car.classList.add('car');

    car.innerHTML = `
<div class="wheel wheel1"></div>
<div class="wheel wheel2"></div>
<div class="wheel wheel3"></div>
<div class="wheel wheel4"></div>
`;

    gameArea.appendChild(car);

    player.x = 160;
    player.y = gameArea.offsetHeight - 120;

    car.style.left = "160px";
    car.style.top = player.y + "px";

    for (let x = 0; x < 3; x++) {
        let enemy = document.createElement('div');
        enemy.classList.add('enemy');

        enemy.innerHTML = `
<div class="wheel wheel1"></div>
<div class="wheel wheel2"></div>
<div class="wheel wheel3"></div>
<div class="wheel wheel4"></div>
`;

        enemy.y = ((x + 1) * -300);

        enemy.style.left = Math.floor(Math.random() * 260) + "px";
        enemy.style.top = enemy.y + "px";

        gameArea.appendChild(enemy);
    }

    createCoin();
    createRain();
    createTrees();

    window.requestAnimationFrame(playGame);
}

function moveLines() {

    let lines = document.querySelectorAll('.line');

    lines.forEach(function (item) {

        if (item.y >= 700) {
            item.y -= 750;
        }

        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function isCollide(a, b) {

    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function moveEnemy(car) {

    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach(function (item) {

        if (isCollide(car, item)) {

            lives--;

            item.y = -300;
            item.style.top = item.y + "px";
            item.style.left =
                Math.floor(Math.random() * 260) + "px";

            if (lives <= 0 && player.start) {
                endGame();
                return;
            }
        }
        if (item.y >= 750) {
            item.y = -300;
            item.style.left = Math.floor(Math.random() * 260) + "px";
        }

        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function createCoin() {

    let coin = document.createElement('div');
    coin.classList.add('coin');

    coin.y = -100;

    coin.style.top = coin.y + "px";
    coin.style.left = Math.floor(Math.random() * 260) + "px";

    gameArea.appendChild(coin);
}
function moveCoin(car) {

    let coin = document.querySelector('.coin');

    if (!coin) return;

    coin.y = coin.y || parseInt(coin.style.top);

    coin.y += player.speed;

    coin.style.top = coin.y + "px";

    if (isCollide(car, coin)) {

        coins++;
        player.score += 50;

        coin.remove();
        createCoin();
    }

    if (coin.y > 700) {

        coin.remove();
        createCoin();
    }
}

function createRain() {

    for (let i = 0; i < 50; i++) {

        let rain = document.createElement("div");

        rain.classList.add("rain");

        rain.style.left = Math.random() * 400 + "px";
        rain.style.top = Math.random() * 300 + "px";
        rain.speed = Math.random() * 8 + 4;

        gameArea.appendChild(rain);
    }
}

function createTrees() {

    for (let i = 0; i < 6; i++) {

        let tree = document.createElement("div");

        tree.classList.add("tree");

        tree.y = i * 120;

        tree.style.top = tree.y + "px";

        if (i % 2 === 0) {
            tree.style.left = "10px";
        } else {
            tree.style.left = "360px";
        }

        gameArea.appendChild(tree);
    }
}

function moveRain() {

    let rains = document.querySelectorAll(".rain");

    rains.forEach(function (item) {

        let top = parseInt(item.style.top);

        top += item.speed;

        if (top > 700) {
            top = -20;
        }

        item.style.top = top + "px";
    });
}

function moveTrees() {

    let trees = document.querySelectorAll(".tree");

    trees.forEach(function (item) {

        if (item.y > 700) {
            item.y = -100;
        }

        item.y += player.speed;

        item.style.top = item.y + "px";
    });
}

function playGame() {

    let car = document.querySelector('.car');
    let road = gameArea.getBoundingClientRect();

    if (player.start) {

        moveLines();
        moveEnemy(car);
        moveCoin(car);
        moveRain();
        moveTrees();

        let speedBox = document.getElementById("speedSelect");

        selectedSpeed = speedBox
            ? Number(speedBox.value)
            : 5;

        player.speed = selectedSpeed;
        if (keys.Shift) {
            nitro = true;
            player.speed = selectedSpeed * 2;
        } else {
            nitro = false;
            player.speed = selectedSpeed;
        }

        if (nitro) {
            car.classList.add("nitro");
        } else {
            car.classList.remove("nitro");
        }

        if (keys.ArrowLeft && player.x > 0) {
            player.x -= moveSpeed;
        }

        if (keys.ArrowRight && player.x < (road.width - 90)) {
            player.x += moveSpeed;
        }

        car.style.left = player.x + "px";
        car.style.top = player.y + "px";

        window.requestAnimationFrame(playGame);

        player.score++;
        if (player.score - lastLevelScore >= 100) {

            level++;

            lastLevelScore = player.score;
        }
        if (player.score - lastThemeScore >= 300) {

            isNight = !isNight;

            if (isNight) {
                gameArea.style.background = "#111";
            } else {
                gameArea.style.background = "#2d3436";
            }

            lastThemeScore = player.score;
        }
        score.innerHTML =
            `
Score : ${player.score}
<br>
🏆 High Score : ${highScore}
<br>
⚡ Speed : ${player.speed}
<br>
🎯 Level : ${level}
<br>
🪙 Coins : ${coins}
<br>
❤️ Lives : ${lives}
<br>
${isNight ? "🌙 Night" : "☀️ Day"}
`;
    }
}

function playCrashSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
        80,
        audioCtx.currentTime + 0.5
    );

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + 0.5
    );

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}
function showExplosion(x, y) {

    let boom = document.createElement("div");

    boom.classList.add("explosion");

    boom.style.left = x + "px";
    boom.style.top = y + "px";

    gameArea.appendChild(boom);

    setTimeout(() => {
        boom.remove();
    }, 600);
}
function endGame() {

    player.start = false;
    if (player.score > highScore) {
        highScore = player.score;
        localStorage.setItem("highScore", highScore);
    }

    playCrashSound();

    let car = document.querySelector(".car");

    if (car) {
        showExplosion(
            car.offsetLeft - 30,
            car.offsetTop - 30
        );
    }
    setTimeout(() => {

        startScreen.classList.remove('hide');

        startScreen.innerHTML = `
<h1>😂💥🤣</h1>
<h2>GAME OVER</h2>

<select id="speedSelect">
    <option value="3">Easy</option>
    <option value="5" selected>Medium</option>
    <option value="8">Hard</option>
    <option value="12">Extreme</option>
</select>

<br><br>

<button id="restartBtn">Restart Game</button>

<p>Score : ${player.score}</p>
<p>🏆 High Score : ${highScore}</p>
`;

        document
            .getElementById("restartBtn")
            .addEventListener("click", start);

    }, 1000);
}