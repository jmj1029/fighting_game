// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const winnerMessage = document.getElementById('winnerMessage');
const winnerText = document.getElementById('winnerText');

// Player class
class Player {
    constructor(x, y, color, controls) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 60;
        this.color = color;
        this.health = 100;
        this.speed = 5;
        this.attacking = false;
        this.attackCooldown = 0;
        this.attackDuration = 15;
        this.controls = controls;
        this.keys = {};
        this.facing = 'right'; // 'left' or 'right'
    }

    update() {
        // Movement
        if (this.keys[this.controls.left]) {
            this.x -= this.speed;
            this.facing = 'left';
        }
        if (this.keys[this.controls.right]) {
            this.x += this.speed;
            this.facing = 'right';
        }
        if (this.keys[this.controls.up]) {
            this.y -= this.speed;
        }
        if (this.keys[this.controls.down]) {
            this.y += this.speed;
        }

        // Boundary checking
        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width - this.width) this.x = canvas.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > canvas.height - this.height) this.y = canvas.height - this.height;

        // Attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }

        // Attack duration
        if (this.attacking) {
            this.attackDuration--;
            if (this.attackDuration <= 0) {
                this.attacking = false;
                this.attackDuration = 15;
            }
        }
    }

    draw() {
        // Draw stick figure
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.beginPath();

        // Head
        ctx.arc(this.x + this.width/2, this.y + 10, 10, 0, Math.PI * 2);

        // Body
        ctx.moveTo(this.x + this.width/2, this.y + 20);
        ctx.lineTo(this.x + this.width/2, this.y + 50);

        // Arms
        const armOffset = this.attacking ? (this.facing === 'right' ? 15 : -15) : 0;
        ctx.moveTo(this.x + this.width/2, this.y + 30);
        ctx.lineTo(this.x + this.width/2 - 15 + armOffset, this.y + 35);
        ctx.moveTo(this.x + this.width/2, this.y + 30);
        ctx.lineTo(this.x + this.width/2 + 15 + armOffset, this.y + 35);

        // Legs
        ctx.moveTo(this.x + this.width/2, this.y + 50);
        ctx.lineTo(this.x + this.width/2 - 10, this.y + 60);
        ctx.moveTo(this.x + this.width/2, this.y + 50);
        ctx.lineTo(this.x + this.width/2 + 10, this.y + 60);

        ctx.stroke();
    }

    attack() {
        if (this.attackCooldown === 0) {
            this.attacking = true;
            this.attackCooldown = 30; // Cooldown frames
            return true;
        }
        return false;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }

    isAttacking() {
        return this.attacking;
    }

    getAttackBox() {
        if (!this.attacking) return null;
        
        const reach = 40;
        if (this.facing === 'right') {
            return {
                x: this.x + this.width/2,
                y: this.y + 25,
                width: reach,
                height: 20
            };
        } else {
            return {
                x: this.x + this.width/2 - reach,
                y: this.y + 25,
                width: reach,
                height: 20
            };
        }
    }
}

// Create players
const player1 = new Player(100, 200, '#4CAF50', {
    up: 'KeyW',
    down: 'KeyS',
    left: 'KeyA',
    right: 'KeyD',
    attack: 'KeyF'
});

const player2 = new Player(600, 200, '#F44336', {
    up: 'KeyO',
    down: 'KeyL',
    left: 'KeyK',
    right: 'Semicolon',
    attack: 'KeyJ'
});

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    // Player 1 controls
    if (e.code === player1.controls.up) player1.keys[player1.controls.up] = true;
    if (e.code === player1.controls.down) player1.keys[player1.controls.down] = true;
    if (e.code === player1.controls.left) player1.keys[player1.controls.left] = true;
    if (e.code === player1.controls.right) player1.keys[player1.controls.right] = true;
    if (e.code === player1.controls.attack) player1.attack();

    // Player 2 controls
    if (e.code === player2.controls.up) player2.keys[player2.controls.up] = true;
    if (e.code === player2.controls.down) player2.keys[player2.controls.down] = true;
    if (e.code === player2.controls.left) player2.keys[player2.controls.left] = true;
    if (e.code === player2.controls.right) player2.keys[player2.controls.right] = true;
    if (e.code === player2.controls.attack) player2.attack();
});

document.addEventListener('keyup', (e) => {
    // Player 1 controls
    if (e.code === player1.controls.up) player1.keys[player1.controls.up] = false;
    if (e.code === player1.controls.down) player1.keys[player1.controls.down] = false;
    if (e.code === player1.controls.left) player1.keys[player1.controls.left] = false;
    if (e.code === player1.controls.right) player1.keys[player1.controls.right] = false;

    // Player 2 controls
    if (e.code === player2.controls.up) player2.keys[player2.controls.up] = false;
    if (e.code === player2.controls.down) player2.keys[player2.controls.down] = false;
    if (e.code === player2.controls.left) player2.keys[player2.controls.left] = false;
    if (e.code === player2.controls.right) player2.keys[player2.controls.right] = false;
});

// Check collision between attack box and player
function checkCollision(box, player) {
    return box.x < player.x + player.width &&
           box.x + box.width > player.x &&
           box.y < player.y + player.height &&
           box.y + box.height > player.y;
}

// Update health bars
function updateHealthBars() {
    document.getElementById('player1-health-bar').style.width = player1.health + '%';
    document.getElementById('player2-health-bar').style.width = player2.health + '%';
    document.getElementById('player1-health-text').textContent = Math.round(player1.health) + '%';
    document.getElementById('player2-health-text').textContent = Math.round(player2.health) + '%';
}

// Show winner message
function showWinner(winner) {
    winnerText.textContent = winner + ' Wins!';
    winnerMessage.style.display = 'block';
}

// Restart game
function restartGame() {
    player1.health = 100;
    player2.health = 100;
    player1.x = 100;
    player1.y = 200;
    player2.x = 600;
    player2.y = 200;
    winnerMessage.style.display = 'none';
    updateHealthBars();
    gameLoop();
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#444';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    // Update players
    player1.update();
    player2.update();

    // Check attacks
    if (player1.isAttacking()) {
        const attackBox = player1.getAttackBox();
        if (attackBox && checkCollision(attackBox, player2)) {
            player2.takeDamage(5);
            updateHealthBars();
        }
    }

    if (player2.isAttacking()) {
        const attackBox = player2.getAttackBox();
        if (attackBox && checkCollision(attackBox, player1)) {
            player1.takeDamage(5);
            updateHealthBars();
        }
    }

    // Draw players
    player1.draw();
    player2.draw();

    // Check for winner
    if (player1.health <= 0) {
        showWinner('Player 2');
        return;
    }
    if (player2.health <= 0) {
        showWinner('Player 1');
        return;
    }

    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Start the game
updateHealthBars();
gameLoop();
