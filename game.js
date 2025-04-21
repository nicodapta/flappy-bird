// Get the canvas and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Get start screen elements
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

// Set canvas size to match CSS dimensions
canvas.width = 400;
canvas.height = 600;

// Game state
let gameStarted = false;
let score = 0;

// Background elements
const background = {
    x: 0,
    width: 400,
    height: 600,
    speed: 2
};

// Cloud properties
const clouds = {
    array: [],
    minSpeed: 0.5,
    maxSpeed: 1.5,
    minSize: 30,
    maxSize: 60,
    spawnInterval: 3000, // milliseconds
    lastSpawn: 0
};

// Ground properties
const ground = {
    y: canvas.height - 100,
    height: 100,
    speed: 2
};

// Pipe properties
const pipes = {
    width: 60,
    gap: 150,
    minHeight: 50,
    maxHeight: 300,
    speed: 2,
    array: []
};

// Bird properties
const bird = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 34,
    height: 24,
    gravity: 0.5,
    velocity: 0,
    jump: -6,
    rotation: 0
};

// Reset game
function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    bird.rotation = 0;
    pipes.array = [];
    clouds.array = [];
    score = 0;
    background.x = 0;
}

// Create new cloud
function createCloud() {
    const now = Date.now();
    if (now - clouds.lastSpawn > clouds.spawnInterval) {
        clouds.array.push({
            x: canvas.width,
            y: Math.random() * (canvas.height / 2),
            size: Math.random() * (clouds.maxSize - clouds.minSize) + clouds.minSize,
            speed: Math.random() * (clouds.maxSpeed - clouds.minSpeed) + clouds.minSpeed
        });
        clouds.lastSpawn = now;
    }
}

// Draw cloud
function drawCloud(x, y, size) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.arc(x + size * 0.5, y - size * 0.3, size * 0.7, 0, Math.PI * 2);
    ctx.arc(x + size * 0.5, y + size * 0.3, size * 0.7, 0, Math.PI * 2);
    ctx.arc(x + size, y, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
}

// Update clouds
function updateClouds() {
    if (gameStarted) {
        createCloud();

        // Update cloud positions
        clouds.array.forEach(cloud => {
            cloud.x -= cloud.speed;
        });

        // Remove clouds that are off screen
        clouds.array = clouds.array.filter(cloud => cloud.x + cloud.size > 0);
    }
}

// Draw background
function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#70c5ce');
    gradient.addColorStop(1, '#87CEEB');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clouds
    clouds.array.forEach(cloud => {
        drawCloud(cloud.x, cloud.y, cloud.size);
    });

    // Ground
    ctx.fillStyle = '#dec165';
    ctx.fillRect(0, ground.y, canvas.width, ground.height);
}

// Create new pipe
function createPipe() {
    const height = Math.random() * (pipes.maxHeight - pipes.minHeight) + pipes.minHeight;
    pipes.array.push({
        x: canvas.width,
        topHeight: height,
        bottomY: height + pipes.gap,
        passed: false
    });
}

// Draw pipes
function drawPipes() {
    pipes.array.forEach(pipe => {
        // Cactus colors
        const cactusColor = '#2D5A27';
        const cactusLightColor = '#3A6B33';
        const cactusDarkColor = '#1E3D1A';

        // Draw top cactus
        // Main body
        ctx.fillStyle = cactusColor;
        ctx.fillRect(pipe.x, 0, pipes.width, pipe.topHeight);

        // Add texture/details
        ctx.fillStyle = cactusLightColor;
        for (let i = 0; i < pipe.topHeight; i += 15) {
            ctx.fillRect(pipe.x + 5, i, 5, 10);
        }

        // Add spikes
        ctx.fillStyle = cactusDarkColor;
        for (let i = 0; i < pipe.topHeight; i += 10) {
            // Left spikes
            ctx.fillRect(pipe.x - 3, i, 3, 2);
            // Right spikes
            ctx.fillRect(pipe.x + pipes.width, i, 3, 2);
        }

        // Draw bottom cactus
        // Main body
        ctx.fillStyle = cactusColor;
        ctx.fillRect(pipe.x, pipe.bottomY, pipes.width, canvas.height - pipe.bottomY);

        // Add texture/details
        ctx.fillStyle = cactusLightColor;
        for (let i = pipe.bottomY; i < canvas.height; i += 15) {
            ctx.fillRect(pipe.x + 5, i, 5, 10);
        }

        // Add spikes
        ctx.fillStyle = cactusDarkColor;
        for (let i = pipe.bottomY; i < canvas.height; i += 10) {
            // Left spikes
            ctx.fillRect(pipe.x - 3, i, 3, 2);
            // Right spikes
            ctx.fillRect(pipe.x + pipes.width, i, 3, 2);
        }
    });
}

// Update pipes
function updatePipes() {
    if (gameStarted) {
        // Create new pipe
        if (pipes.array.length === 0 || pipes.array[pipes.array.length - 1].x < canvas.width - 200) {
            createPipe();
        }

        // Update pipe positions
        pipes.array.forEach(pipe => {
            pipe.x -= pipes.speed;

            // Check if bird passed the pipe
            if (!pipe.passed && pipe.x + pipes.width < bird.x) {
                pipe.passed = true;
                score++;
            }
        });

        // Remove pipes that are off screen
        pipes.array = pipes.array.filter(pipe => pipe.x + pipes.width > 0);
    }
}

// Check collisions
function checkCollision() {
    const birdRadius = bird.width / 2;

    // Check ground collision
    if (bird.y + birdRadius > ground.y) {
        return true;
    }

    // Check pipe collisions
    return pipes.array.some(pipe => {
        // Top pipe collision
        if (bird.x + birdRadius > pipe.x &&
            bird.x - birdRadius < pipe.x + pipes.width &&
            bird.y - birdRadius < pipe.topHeight) {
            return true;
        }

        // Bottom pipe collision
        if (bird.x + birdRadius > pipe.x &&
            bird.x - birdRadius < pipe.x + pipes.width &&
            bird.y + birdRadius > pipe.bottomY) {
            return true;
        }

        return false;
    });
}

// Draw score
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(score.toString(), canvas.width / 2, 100);
}

// Reset bird position
function resetBird() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    bird.rotation = 0;
}

// Draw the bird
function drawBird() {
    ctx.save();

    // Translate to bird's position
    ctx.translate(bird.x, bird.y);

    // Rotate based on velocity
    bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.velocity * 0.1));
    ctx.rotate(bird.rotation);

    // Draw bird body
    ctx.fillStyle = '#f4d03f';
    ctx.beginPath();
    ctx.arc(0, 0, bird.width / 2, 0, Math.PI * 2);
    ctx.fill();

    // Add eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(8, -2, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(8, -2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Add beak
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(20, -2);
    ctx.lineTo(20, 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

// Update bird position
function updateBird() {
    // Apply gravity
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Prevent bird from going above the canvas
    if (bird.y - bird.width / 2 < 0) {
        bird.y = bird.width / 2;
        bird.velocity = 0;
    }

    // Check for collisions
    if (checkCollision()) {
        gameStarted = false;
        startScreen.style.display = 'flex';
        resetGame();
    }
}

// Handle spacebar press
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && gameStarted) {
        bird.velocity = bird.jump;
    }
});

// Start button click handler
startButton.addEventListener('click', () => {
    gameStarted = true;
    startScreen.style.display = 'none';
    resetGame();
});

// Game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    drawBackground();

    if (gameStarted) {
        // Update bird position
        updateBird();
        // Update pipes
        updatePipes();
        // Update clouds
        updateClouds();
    }

    // Draw pipes
    drawPipes();

    // Draw the bird
    drawBird();

    // Draw score
    drawScore();

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop(); 