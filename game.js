const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 12;
const paddleHeight = 80;
const ballRadius = 10;

let leftPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#0ff',
};

let rightPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#f00',
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 5 * (Math.random() < 0.5 ? 1 : -1),
    vy: 3 * (Math.random() < 0.5 ? 1 : -1),
    radius: ballRadius,
    color: '#fff',
};

let leftScore = 0;
let rightScore = 0;

// Mouse control for left paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height / 2;
    // Clamp within the canvas
    leftPaddle.y = Math.max(0, Math.min(canvas.height - leftPaddle.height, leftPaddle.y));
});

// Draw game objects
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "32px Arial";
    ctx.fillText(text, x, y);
}

// Collision detection
function collision(ball, paddle) {
    return (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.y + ball.radius > paddle.y
    );
}

// AI for right paddle
function aiMove() {
    let paddleCenter = rightPaddle.y + rightPaddle.height / 2;
    if (ball.y < paddleCenter - 10) {
        rightPaddle.y -= 4;
    } else if (ball.y > paddleCenter + 10) {
        rightPaddle.y += 4;
    }
    // Clamp
    rightPaddle.y = Math.max(0, Math.min(canvas.height - rightPaddle.height, rightPaddle.y));
}

// Reset ball after score
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 5 * (Math.random() < 0.5 ? 1 : -1);
    ball.vy = 3 * (Math.random() < 0.5 ? 1 : -1);
}

// Main game loop
function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top and bottom wall collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.vy = -ball.vy;
    }

    // Paddle collision
    if (collision(ball, leftPaddle)) {
        ball.vx = Math.abs(ball.vx);
        // Add some "spin"
        ball.vy += (ball.y - (leftPaddle.y + leftPaddle.height / 2)) * 0.15;
    } else if (collision(ball, rightPaddle)) {
        ball.vx = -Math.abs(ball.vx);
        ball.vy += (ball.y - (rightPaddle.y + rightPaddle.height / 2)) * 0.15;
    }

    // Left and right wall (score)
    if (ball.x - ball.radius < 0) {
        rightScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        leftScore++;
        resetBall();
    }

    // Move right paddle (AI)
    aiMove();
}

// Render everything
function render() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw net
    for (let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width / 2 - 2, i, 4, 20, "#aaa");
    }

    // Draw paddles
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, leftPaddle.color);
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, rightPaddle.color);

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // Draw scores
    drawText(leftScore, canvas.width / 2 - 60, 50, "#0ff");
    drawText(rightScore, canvas.width / 2 + 30, 50, "#f00");
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
