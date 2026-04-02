// Super Mario Bros - 1:1 Recreation
// Game Constants
const TILE_SIZE = 16;
const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;
const SCALE = 3;
const GRAVITY = 0.25;
const FRICTION = 0.85;
const MAX_SPEED = 1.5;
const RUN_MAX_SPEED = 2.5;
const ACCELERATION = 0.1;
const JUMP_FORCE = -4.2;
const BIG_JUMP_FORCE = -4.5;

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
canvas.style.width = SCREEN_WIDTH * SCALE + 'px';
canvas.style.height = SCREEN_HEIGHT * SCALE + 'px';
ctx.imageSmoothingEnabled = false;

// Audio Context
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
}

// Sound effects generator
function playSound(type) {
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    
    switch(type) {
        case 'jump':
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(300, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
            break;
        case 'coin':
            osc.type = 'square';
            osc.frequency.setValueAtTime(988, now);
            osc.frequency.setValueAtTime(1319, now + 0.07);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
            break;
        case 'stomp':
            osc.type = 'square';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
            break;
        case 'powerup':
            osc.type = 'square';
            for (let i = 0; i < 5; i++) {
                osc.frequency.setValueAtTime(400 + i * 100, now + i * 0.05);
            }
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
        case 'die':
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.5);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
            break;
        case 'bump':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.05);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
            break;
        case 'break':
            osc.type = 'square';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(30, now + 0.1);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
            break;
        case 'pipe':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(200, now + 0.2);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
            break;
        case 'flagpole':
            osc.type = 'square';
            const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
            notes.forEach((freq, i) => {
                osc.frequency.setValueAtTime(freq, now + i * 0.08);
            });
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.7);
            osc.start(now);
            osc.stop(now + 0.7);
            break;
        case 'gameover':
            osc.type = 'square';
            const goNotes = [392, 330, 262, 196, 165, 196];
            goNotes.forEach((freq, i) => {
                osc.frequency.setValueAtTime(freq, now + i * 0.25);
            });
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 1.5);
            osc.start(now);
            osc.stop(now + 1.5);
            break;
    }
}

// Color palette (NES accurate)
const COLORS = {
    sky: '#5C94FC',
    ground: '#C84C0C',
    groundDark: '#A0380C',
    brick: '#C84C0C',
    brickDark: '#A0380C',
    brickLine: '#FC9838',
    question: '#FC9838',
    questionDark: '#C84C0C',
    pipe: '#00A800',
    pipeDark: '#005800',
    pipeLight: '#80D010',
    mario: '#E44040',
    marioSkin: '#FCA044',
    marioHair: '#AC7C00',
    luigi: '#00A800',
    goomba: '#AC7C00',
    goombaDark: '#805800',
    koopa: '#00A800',
    koopaDark: '#005800',
    mushroom: '#E44040',
    mushroomWhite: '#FCA044',
    coin: '#FCB838',
    coinDark: '#C87820',
    cloud: '#FCFCFC',
    bush: '#00A800',
    bushDark: '#005800',
    hill: '#80D010',
    hillDark: '#00A800',
    castle: '#AC7C00',
    castleDark: '#805800',
    flag: '#00A800',
    flagPole: '#888888',
    text: '#FCFCFC',
    score: '#FCFCFC',
};

// Tile types
const TILES = {
    EMPTY: 0,
    GROUND: 1,
    BRICK: 2,
    QUESTION: 3,
    PIPE_TL: 4,
    PIPE_TR: 5,
    PIPE_BL: 6,
    PIPE_BR: 7,
    HARD_BLOCK: 8,
    USED_BLOCK: 9,
    INVISIBLE: 10,
};

// Game state
let gameState = 'title'; // title, playing, gameover, win
let score = 0;
let coins = 0;
let lives = 3;
let time = 400;
let timeCounter = 0;
let cameraX = 0;
let levelComplete = false;
let deathAnimation = false;
let deathTimer = 0;

// Input handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
    }
    if (gameState === 'title' && (e.code === 'Space' || e.code === 'Enter')) {
        initAudio();
        startGame();
    }
    if (gameState === 'gameover' && (e.code === 'Space' || e.code === 'Enter')) {
        resetGame();
    }
});
window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Level 1-1 map (220 tiles wide, 15 tiles high)
function createLevel1_1() {
    const width = 220;
    const height = 15;
    const map = [];
    
    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = TILES.EMPTY;
        }
    }
    
    // Ground (rows 13-14)
    for (let x = 0; x < width; x++) {
        // Gaps
        if ((x >= 69 && x <= 70) || (x >= 86 && x <= 88) || (x >= 153 && x <= 154)) {
            continue;
        }
        map[13][x] = TILES.GROUND;
        map[14][x] = TILES.GROUND;
    }
    
    // Question blocks with coins
    map[9][16] = TILES.QUESTION;
    map[9][21] = TILES.QUESTION;
    map[9][23] = TILES.BRICK;
    map[9][22] = TILES.QUESTION;
    map[5][22] = TILES.QUESTION;
    map[9][78] = TILES.QUESTION;
    map[9][94] = TILES.QUESTION;
    map[9][106] = TILES.QUESTION;
    map[9][109] = TILES.QUESTION;
    map[9][112] = TILES.QUESTION;
    map[5][109] = TILES.QUESTION;
    map[9][129] = TILES.QUESTION;
    map[9][130] = TILES.QUESTION;
    map[9][170] = TILES.QUESTION;
    
    // Brick blocks
    map[9][20] = TILES.BRICK;
    map[9][24] = TILES.BRICK;
    map[5][77] = TILES.BRICK;
    map[5][79] = TILES.BRICK;
    map[5][80] = TILES.BRICK;
    map[9][80] = TILES.BRICK;
    map[9][81] = TILES.BRICK;
    map[9][87] = TILES.BRICK;
    map[9][88] = TILES.BRICK;
    map[9][89] = TILES.BRICK;
    map[9][90] = TILES.BRICK;
    map[9][91] = TILES.BRICK;
    map[9][92] = TILES.BRICK;
    map[9][93] = TILES.BRICK;
    map[9][100] = TILES.BRICK;
    map[9][101] = TILES.BRICK;
    map[5][100] = TILES.BRICK;
    map[5][101] = TILES.BRICK;
    map[5][102] = TILES.BRICK;
    map[9][118] = TILES.BRICK;
    map[9][119] = TILES.BRICK;
    map[9][120] = TILES.BRICK;
    map[9][121] = TILES.BRICK;
    map[9][128] = TILES.BRICK;
    map[9][131] = TILES.BRICK;
    map[9][129] = TILES.QUESTION;
    map[9][130] = TILES.QUESTION;
    map[9][168] = TILES.BRICK;
    map[9][169] = TILES.BRICK;
    map[9][171] = TILES.BRICK;
    
    // Pipes
    // Pipe 1 (height 2)
    map[11][28] = TILES.PIPE_TL;
    map[11][29] = TILES.PIPE_TR;
    map[12][28] = TILES.PIPE_BL;
    map[12][29] = TILES.PIPE_BR;
    
    // Pipe 2 (height 3)
    map[10][38] = TILES.PIPE_TL;
    map[10][39] = TILES.PIPE_TR;
    map[11][38] = TILES.PIPE_BL;
    map[11][39] = TILES.PIPE_BR;
    map[12][38] = TILES.PIPE_BL;
    map[12][39] = TILES.PIPE_BR;
    
    // Pipe 3 (height 4)
    map[9][46] = TILES.PIPE_TL;
    map[9][47] = TILES.PIPE_TR;
    map[10][46] = TILES.PIPE_BL;
    map[10][47] = TILES.PIPE_BR;
    map[11][46] = TILES.PIPE_BL;
    map[11][47] = TILES.PIPE_BR;
    map[12][46] = TILES.PIPE_BL;
    map[12][47] = TILES.PIPE_BR;
    
    // Pipe 4 (height 4)
    map[9][57] = TILES.PIPE_TL;
    map[9][58] = TILES.PIPE_TR;
    map[10][57] = TILES.PIPE_BL;
    map[10][58] = TILES.PIPE_BR;
    map[11][57] = TILES.PIPE_BL;
    map[11][58] = TILES.PIPE_BR;
    map[12][57] = TILES.PIPE_BL;
    map[12][58] = TILES.PIPE_BR;
    
    // Stairs near end
    // Stair 1 (ascending)
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j <= i; j++) {
            map[12 - j][134 + i] = TILES.HARD_BLOCK;
        }
    }
    
    // Stair 2 (descending)
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j <= i; j++) {
            map[12 - j][143 - i] = TILES.HARD_BLOCK;
        }
    }
    
    // Stair 3 (ascending)
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j <= i; j++) {
            map[12 - j][148 + i] = TILES.HARD_BLOCK;
        }
    }
    
    // Stair 4 (descending)
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j <= i; j++) {
            map[12 - j][157 - i] = TILES.HARD_BLOCK;
        }
    }
    
    // Final stair to flagpole
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j <= i; j++) {
            map[12 - j][181 + i] = TILES.HARD_BLOCK;
        }
    }
    
    // Castle area hard blocks
    for (let x = 198; x < 210; x++) {
        for (let y = 9; y < 13; y++) {
            map[y][x] = TILES.HARD_BLOCK;
        }
    }
    
    return { map, width, height };
}

// Block contents
const blockContents = {};
function initBlockContents() {
    blockContents['9,16'] = 'coin';
    blockContents['9,21'] = 'coin';
    blockContents['9,22'] = 'coin';
    blockContents['5,22'] = 'mushroom';
    blockContents['9,78'] = 'coin';
    blockContents['9,94'] = 'star';
    blockContents['9,106'] = 'coin';
    blockContents['9,109'] = 'mushroom';
    blockContents['5,109'] = 'coin';
    blockContents['9,112'] = 'coin';
    blockContents['9,129'] = 'coin';
    blockContents['9,130'] = 'coin';
    blockContents['9,170'] = 'coin';
}

// Mario class
class Mario {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = 12;
        this.height = 16;
        this.isBig = false;
        this.isFire = false;
        this.facing = 1;
        this.isJumping = false;
        this.isRunning = false;
        this.animFrame = 0;
        this.animTimer = 0;
        this.invincible = 0;
        this.dead = false;
        this.winning = false;
        this.winTimer = 0;
        this.crouching = false;
    }
    
    update() {
        if (this.dead) {
            this.vy += GRAVITY;
            this.y += this.vy;
            return;
        }
        
        if (this.winning) {
            this.winTimer++;
            if (this.winTimer < 60) {
                this.y += 1;
            } else if (this.winTimer < 180) {
                this.vx = 1.5;
                this.x += this.vx;
                this.facing = 1;
                this.animTimer++;
                if (this.animTimer > 6) {
                    this.animTimer = 0;
                    this.animFrame = (this.animFrame + 1) % 3;
                }
            }
            return;
        }
        
        if (this.invincible > 0) this.invincible--;
        
        // Movement
        const maxSpeed = keys['ShiftLeft'] || keys['ShiftRight'] ? RUN_MAX_SPEED : MAX_SPEED;
        this.isRunning = keys['ShiftLeft'] || keys['ShiftRight'];
        
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.vx -= ACCELERATION;
            this.facing = -1;
        } else if (keys['ArrowRight'] || keys['KeyD']) {
            this.vx += ACCELERATION;
            this.facing = 1;
        } else {
            this.vx *= FRICTION;
            if (Math.abs(this.vx) < 0.05) this.vx = 0;
        }
        
        // Clamp speed
        if (this.vx > maxSpeed) this.vx = maxSpeed;
        if (this.vx < -maxSpeed) this.vx = -maxSpeed;
        
        // Jump
        if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && !this.isJumping) {
            this.vy = this.isBig ? BIG_JUMP_FORCE : JUMP_FORCE;
            this.isJumping = true;
            playSound('jump');
        }
        
        // Variable jump height
        if (!(keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && this.vy < -1) {
            this.vy = -1;
        }
        
        // Crouch (only when big)
        this.crouching = this.isBig && (keys['ArrowDown'] || keys['KeyS']) && !this.isJumping;
        if (this.crouching) {
            this.height = 24;
            this.vx *= 0.5;
        } else {
            this.height = this.isBig ? 32 : 16;
        }
        
        // Apply gravity
        this.vy += GRAVITY;
        if (this.vy > 6) this.vy = 6;
        
        // Move X
        this.x += this.vx;
        this.handleCollisionX();
        
        // Move Y
        this.y += this.vy;
        this.isJumping = this.handleCollisionY();
        
        // Animation
        if (!this.isJumping && Math.abs(this.vx) > 0.1) {
            this.animTimer++;
            const speed = Math.abs(this.vx) > 1.5 ? 3 : 6;
            if (this.animTimer > speed) {
                this.animTimer = 0;
                this.animFrame = (this.animFrame + 1) % 3;
            }
        } else if (!this.isJumping) {
            this.animFrame = 0;
            this.animTimer = 0;
        }
        
        // World bounds
        if (this.x < 0) this.x = 0;
        if (this.x > level.width * TILE_SIZE - this.width) {
            this.x = level.width * TILE_SIZE - this.width;
        }
        
        // Fall death
        if (this.y > SCREEN_HEIGHT + 16) {
            this.die();
        }
    }
    
    handleCollisionX() {
        const left = Math.floor(this.x / TILE_SIZE);
        const right = Math.floor((this.x + this.width) / TILE_SIZE);
        const top = Math.floor(this.y / TILE_SIZE);
        const bottom = Math.floor((this.y + this.height - 1) / TILE_SIZE);
        
        for (let y = top; y <= bottom; y++) {
            for (let x = left; x <= right; x++) {
                if (isSolid(x, y)) {
                    if (this.vx > 0) {
                        this.x = x * TILE_SIZE - this.width - 0.01;
                        this.vx = 0;
                    } else if (this.vx < 0) {
                        this.x = (x + 1) * TILE_SIZE + 0.01;
                        this.vx = 0;
                    }
                }
            }
        }
    }
    
    handleCollisionY() {
        let jumping = true;
        const left = Math.floor(this.x / TILE_SIZE);
        const right = Math.floor((this.x + this.width) / TILE_SIZE);
        const top = Math.floor(this.y / TILE_SIZE);
        const bottom = Math.floor((this.y + this.height) / TILE_SIZE);
        
        for (let y = top; y <= bottom; y++) {
            for (let x = left; x <= right; x++) {
                if (isSolid(x, y)) {
                    if (this.vy > 0) {
                        this.y = y * TILE_SIZE - this.height;
                        this.vy = 0;
                        jumping = false;
                    } else if (this.vy < 0) {
                        this.y = (y + 1) * TILE_SIZE;
                        this.vy = 0;
                        hitBlock(x, y);
                    }
                }
            }
        }
        
        return jumping;
    }
    
    grow() {
        if (!this.isBig) {
            this.isBig = true;
            this.y -= 16;
            this.height = 32;
            playSound('powerup');
        }
    }
    
    shrink() {
        if (this.isBig) {
            this.isBig = false;
            this.isFire = false;
            this.height = 16;
            this.invincible = 120;
            playSound('pipe');
        } else {
            this.die();
        }
    }
    
    die() {
        if (this.dead) return;
        this.dead = true;
        this.vy = -5;
        this.vx = 0;
        deathAnimation = true;
        deathTimer = 0;
        playSound('die');
    }
    
    draw() {
        if (this.dead) {
            drawDeadMario(this.x - cameraX, this.y);
            return;
        }
        
        if (this.invincible > 0 && Math.floor(this.invincible / 3) % 2 === 0) return;
        
        const x = Math.floor(this.x - cameraX);
        const y = Math.floor(this.y);
        
        if (this.crouching) {
            drawCrouchingMario(x, y, this.facing, this.isBig, this.isFire);
        } else if (this.isJumping) {
            drawJumpingMario(x, y, this.facing, this.isBig, this.isFire);
        } else {
            drawWalkingMario(x, y, this.facing, this.animFrame, this.isBig, this.isFire);
        }
    }
}

// Enemy classes
class Goomba {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = -0.5;
        this.vy = 0;
        this.width = 16;
        this.height = 16;
        this.dead = false;
        this.deadTimer = 0;
        this.animFrame = 0;
        this.animTimer = 0;
    }
    
    update() {
        if (this.dead) {
            this.deadTimer++;
            return;
        }
        
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;
        
        // Ground collision
        const bottom = Math.floor((this.y + this.height) / TILE_SIZE);
        const left = Math.floor(this.x / TILE_SIZE);
        const right = Math.floor((this.x + this.width - 1) / TILE_SIZE);
        
        for (let x = left; x <= right; x++) {
            if (isSolid(x, bottom)) {
                this.y = bottom * TILE_SIZE - this.height;
                this.vy = 0;
            }
        }
        
        // Wall collision
        const wallY = Math.floor((this.y + 4) / TILE_SIZE);
        if (this.vx < 0 && isSolid(left, wallY)) {
            this.vx = 0.5;
        } else if (this.vx > 0 && isSolid(right, wallY)) {
            this.vx = -0.5;
        }
        
        // Animation
        this.animTimer++;
        if (this.animTimer > 12) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 2;
        }
        
        // Remove if off screen
        if (this.y > SCREEN_HEIGHT + 32) this.dead = true;
    }
    
    draw() {
        const x = Math.floor(this.x - cameraX);
        const y = Math.floor(this.y);
        
        if (x < -16 || x > SCREEN_WIDTH + 16) return;
        
        if (this.dead && this.deadTimer < 30) {
            drawSquishedGoomba(x, y);
        } else if (!this.dead) {
            drawGoomba(x, y, this.animFrame);
        }
    }
}

class Koopa {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = -0.5;
        this.vy = 0;
        this.width = 16;
        this.height = 24;
        this.dead = false;
        this.inShell = false;
        this.shellMoving = false;
        this.deadTimer = 0;
        this.animFrame = 0;
        this.animTimer = 0;
    }
    
    update() {
        if (this.dead) {
            this.deadTimer++;
            return;
        }
        
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;
        
        // Ground collision
        const bottom = Math.floor((this.y + this.height) / TILE_SIZE);
        const left = Math.floor(this.x / TILE_SIZE);
        const right = Math.floor((this.x + this.width - 1) / TILE_SIZE);
        
        for (let x = left; x <= right; x++) {
            if (isSolid(x, bottom)) {
                this.y = bottom * TILE_SIZE - this.height;
                this.vy = 0;
            }
        }
        
        // Wall collision
        const wallY = Math.floor((this.y + 4) / TILE_SIZE);
        if (this.vx < 0 && isSolid(left, wallY)) {
            this.vx = this.inShell ? -3 : 0.5;
        } else if (this.vx > 0 && isSolid(right, wallY)) {
            this.vx = this.inShell ? 3 : -0.5;
        }
        
        // Animation
        this.animTimer++;
        if (this.animTimer > 12) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 2;
        }
        
        if (this.y > SCREEN_HEIGHT + 32) this.dead = true;
    }
    
    draw() {
        const x = Math.floor(this.x - cameraX);
        const y = Math.floor(this.y);
        
        if (x < -16 || x > SCREEN_WIDTH + 16) return;
        
        if (this.inShell) {
            drawKoopaShell(x, y);
        } else if (!this.dead) {
            drawKoopa(x, y, this.animFrame);
        }
    }
}

// Item classes
class Mushroom {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.startY = y;
        this.vx = 1;
        this.vy = 0;
        this.width = 16;
        this.height = 16;
        this.emerging = true;
        this.emergeTimer = 0;
        this.collected = false;
        this.animFrame = 0;
        this.animTimer = 0;
    }
    
    update() {
        if (this.collected) return;
        
        if (this.emerging) {
            this.emergeTimer++;
            this.y -= 0.5;
            if (this.emergeTimer >= 32) {
                this.emerging = false;
                this.y = this.startY;
            }
            return;
        }
        
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;
        
        // Ground collision
        const bottom = Math.floor((this.y + this.height) / TILE_SIZE);
        const left = Math.floor(this.x / TILE_SIZE);
        const right = Math.floor((this.x + this.width - 1) / TILE_SIZE);
        
        for (let x = left; x <= right; x++) {
            if (isSolid(x, bottom)) {
                this.y = bottom * TILE_SIZE - this.height;
                this.vy = 0;
            }
        }
        
        // Wall collision
        const wallY = Math.floor((this.y + 4) / TILE_SIZE);
        if (this.vx < 0 && isSolid(left, wallY)) {
            this.vx = 1;
        } else if (this.vx > 0 && isSolid(right, wallY)) {
            this.vx = -1;
        }
        
        // Animation
        this.animTimer++;
        if (this.animTimer > 8) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 2;
        }
    }
    
    draw() {
        if (this.collected) return;
        const x = Math.floor(this.x - cameraX);
        const y = Math.floor(this.y);
        if (x < -16 || x > SCREEN_WIDTH + 16) return;
        drawMushroom(x, y, this.animFrame);
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.startY = y;
        this.vy = -4;
        this.width = 8;
        this.height = 14;
        this.collected = false;
        this.animFrame = 0;
        this.animTimer = 0;
    }
    
    update() {
        if (this.collected) return;
        this.vy += 0.2;
        this.y += this.vy;
        this.animTimer++;
        if (this.animTimer > 4) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }
        if (this.y > this.startY + 32) this.collected = true;
    }
    
    draw() {
        if (this.collected) return;
        const x = Math.floor(this.x - cameraX);
        const y = Math.floor(this.y);
        drawCoinAnimation(x, y, this.animFrame);
    }
}

class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 1.5;
        this.vy = -3;
        this.width = 16;
        this.height = 16;
        this.collected = false;
        this.animFrame = 0;
        this.animTimer = 0;
    }
    
    update() {
        if (this.collected) return;
        
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off ground
        const bottom = Math.floor((this.y + this.height) / TILE_SIZE);
        const left = Math.floor(this.x / TILE_SIZE);
        const right = Math.floor((this.x + this.width - 1) / TILE_SIZE);
        
        for (let x = left; x <= right; x++) {
            if (isSolid(x, bottom)) {
                this.y = bottom * TILE_SIZE - this.height;
                this.vy = -4;
            }
        }
        
        // Bounce off walls
        const wallY = Math.floor((this.y + 4) / TILE_SIZE);
        if (this.vx < 0 && isSolid(left, wallY)) this.vx = 1.5;
        else if (this.vx > 0 && isSolid(right, wallY)) this.vx = -1.5;
        
        this.animTimer++;
        if (this.animTimer > 4) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }
    }
    
    draw() {
        if (this.collected) return;
        const x = Math.floor(this.x - cameraX);
        const y = Math.floor(this.y);
        drawStar(x, y, this.animFrame);
    }
}

// Particle class for brick breaking
class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = 60;
        this.size = 4;
    }
    
    update() {
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }
    
    draw() {
        const x = Math.floor(this.x - cameraX);
        const y = Math.floor(this.y);
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, this.size, this.size);
    }
}

// Score popup
class ScorePopup {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.life = 40;
    }
    
    update() {
        this.y -= 0.5;
        this.life--;
    }
    
    draw() {
        const x = Math.floor(this.x - cameraX);
        const y = Math.floor(this.y);
        ctx.fillStyle = COLORS.score;
        ctx.font = '8px monospace';
        ctx.fillText(this.text, x, y);
    }
}

// Game objects
let mario;
let enemies = [];
let items = [];
let particles = [];
let scorePopups = [];
let level;
let usedBlocks = {};
let blockHitAnim = {};

function initLevel() {
    level = createLevel1_1();
    initBlockContents();
    usedBlocks = {};
    blockHitAnim = {};
    
    mario = new Mario(32, 176);
    
    enemies = [];
    // Goombas
    enemies.push(new Goomba(22 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(40 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(51 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(52.5 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(80 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(82 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(97 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(98.5 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(115 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(116.5 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(124 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(125.5 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(128 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(129.5 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(174 * TILE_SIZE, 11 * TILE_SIZE));
    enemies.push(new Goomba(175.5 * TILE_SIZE, 11 * TILE_SIZE));
    
    // Koopas
    enemies.push(new Koopa(107 * TILE_SIZE, 10 * TILE_SIZE));
    enemies.push(new Koopa(163 * TILE_SIZE, 10 * TILE_SIZE));
    
    items = [];
    particles = [];
    scorePopups = [];
}

function isSolid(x, y) {
    if (x < 0 || x >= level.width || y < 0 || y >= level.height) return false;
    const tile = level.map[y][x];
    return tile !== TILES.EMPTY && tile !== TILES.INVISIBLE;
}

function hitBlock(x, y) {
    const key = `${x},${y}`;
    if (usedBlocks[key]) return;
    
    const tile = level.map[y][x];
    
    if (tile === TILES.BRICK) {
        if (mario.isBig) {
            // Break brick
            level.map[y][x] = TILES.EMPTY;
            playSound('break');
            // Create particles
            for (let i = 0; i < 4; i++) {
                particles.push(new Particle(
                    x * TILE_SIZE + (i % 2) * 8,
                    y * TILE_SIZE + Math.floor(i / 2) * 8,
                    (i % 2 === 0 ? -1 : 1) * (1 + Math.random()),
                    -3 - Math.random() * 2,
                    COLORS.brick
                ));
            }
            score += 50;
        } else {
            playSound('bump');
            blockHitAnim[key] = { timer: 6, origY: y * TILE_SIZE };
        }
    } else if (tile === TILES.QUESTION) {
        level.map[y][x] = TILES.USED_BLOCK;
        usedBlocks[key] = true;
        playSound('bump');
        blockHitAnim[key] = { timer: 6, origY: y * TILE_SIZE };
        
        const content = blockContents[key] || 'coin';
        
        if (content === 'coin') {
            coins++;
            score += 200;
            playSound('coin');
            items.push(new Coin(x * TILE_SIZE + 4, y * TILE_SIZE - 16));
            scorePopups.push(new ScorePopup(x * TILE_SIZE, y * TILE_SIZE - 8, '200'));
            if (coins >= 100) {
                coins -= 100;
                lives++;
            }
        } else if (content === 'mushroom') {
            playSound('powerup');
            items.push(new Mushroom(x * TILE_SIZE, (y - 1) * TILE_SIZE));
        } else if (content === 'star') {
            playSound('powerup');
            items.push(new Star(x * TILE_SIZE, (y - 1) * TILE_SIZE));
        }
    }
}

function checkEntityCollisions() {
    if (mario.dead || mario.winning) return;
    
    // Enemy collisions
    for (let enemy of enemies) {
        if (enemy.dead) continue;
        
        const dx = (mario.x + mario.width / 2) - (enemy.x + enemy.width / 2);
        const dy = (mario.y + mario.height / 2) - (enemy.y + enemy.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 14) {
            if (enemy instanceof Koopa && enemy.inShell && !enemy.shellMoving) {
                // Kick shell
                enemy.shellMoving = true;
                enemy.vx = mario.x < enemy.x ? 4 : -4;
                playSound('stomp');
                score += 400;
            } else if (mario.vy > 0 && mario.y + mario.height - 4 < enemy.y + enemy.height / 2) {
                // Stomp
                mario.vy = -3;
                if (enemy instanceof Goomba) {
                    enemy.dead = true;
                    enemy.deadTimer = 0;
                    score += 100;
                    scorePopups.push(new ScorePopup(enemy.x, enemy.y - 8, '100'));
                } else if (enemy instanceof Koopa) {
                    if (!enemy.inShell) {
                        enemy.inShell = true;
                        enemy.height = 16;
                        enemy.vx = 0;
                        score += 100;
                    } else {
                        enemy.shellMoving = true;
                        enemy.vx = mario.x < enemy.x ? 4 : -4;
                        score += 100;
                    }
                }
                playSound('stomp');
            } else if (mario.invincible <= 0) {
                if (enemy instanceof Koopa && enemy.inShell && !enemy.shellMoving) {
                    enemy.shellMoving = true;
                    enemy.vx = mario.x < enemy.x ? 4 : -4;
                    playSound('stomp');
                } else {
                    mario.shrink();
                }
            }
        }
    }
    
    // Item collisions
    for (let item of items) {
        if (item.collected) continue;
        
        // AABB collision detection
        if (mario.x < item.x + item.width &&
            mario.x + mario.width > item.x &&
            mario.y < item.y + item.height &&
            mario.y + mario.height > item.y) {
            
            if (item instanceof Mushroom) {
                item.collected = true;
                mario.grow();
                score += 1000;
                scorePopups.push(new ScorePopup(item.x, item.y - 8, '1000'));
            } else if (item instanceof Star) {
                item.collected = true;
                mario.invincible = 600;
                score += 1000;
                scorePopups.push(new ScorePopup(item.x, item.y - 8, '1000'));
            }
        }
    }
    
    // Shell killing enemies
    for (let enemy of enemies) {
        if (enemy instanceof Koopa && enemy.inShell && enemy.shellMoving) {
            for (let other of enemies) {
                if (other === enemy || other.dead) continue;
                const dx = (enemy.x + enemy.width / 2) - (other.x + other.width / 2);
                const dy = (enemy.y + enemy.height / 2) - (other.y + other.height / 2);
                if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
                    other.dead = true;
                    score += 100;
                    playSound('stomp');
                }
            }
        }
    }
}

function checkFlagpole() {
    if (levelComplete || mario.dead || mario.winning) return;
    
    const flagX = 198 * TILE_SIZE;
    if (mario.x + mario.width >= flagX && mario.x <= flagX + 8) {
        levelComplete = true;
        mario.winning = true;
        mario.winTimer = 0;
        mario.vx = 0;
        mario.x = flagX - mario.width;
        playSound('flagpole');
        
        // Score based on height
        const heightScore = Math.max(0, Math.floor((13 * TILE_SIZE - mario.y) / 10)) * 100;
        score += heightScore + 5000;
    }
}

// Drawing functions
function drawPixelRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
}

function drawMarioSprite(x, y, facing, frame, big, fire, jumping, crouching) {
    const skin = COLORS.marioSkin;
    const main = fire ? COLORS.text : COLORS.mario;
    const hair = COLORS.marioHair;
    
    ctx.save();
    if (facing === -1) {
        ctx.translate(x + 12, 0);
        ctx.scale(-1, 1);
        x = 0;
    }
    
    if (crouching && big) {
        // Crouching big Mario
        // Hat
        drawPixelRect(x + 2, y, 8, 4, main);
        // Face
        drawPixelRect(x + 2, y + 4, 10, 6, skin);
        drawPixelRect(x + 8, y + 6, 4, 2, hair);
        // Body
        drawPixelRect(x + 2, y + 10, 10, 8, main);
        drawPixelRect(x + 4, y + 12, 6, 4, skin);
        // Legs
        drawPixelRect(x + 2, y + 18, 4, 6, hair);
        drawPixelRect(x + 8, y + 18, 4, 6, hair);
    } else if (big) {
        // Big Mario
        // Hat
        drawPixelRect(x + 2, y, 8, 4, main);
        drawPixelRect(x + 1, y + 2, 10, 2, main);
        // Face
        drawPixelRect(x + 1, y + 4, 10, 6, skin);
        drawPixelRect(x + 8, y + 6, 4, 2, hair);
        drawPixelRect(x + 2, y + 5, 2, 2, '#000');
        // Body
        drawPixelRect(x + 2, y + 10, 10, 8, main);
        drawPixelRect(x + 4, y + 12, 6, 4, skin);
        // Belt
        drawPixelRect(x + 2, y + 16, 10, 2, hair);
        // Legs
        if (jumping) {
            drawPixelRect(x, y + 18, 4, 6, hair);
            drawPixelRect(x + 8, y + 22, 4, 6, hair);
            drawPixelRect(x + 10, y + 26, 4, 4, skin);
        } else if (frame === 1) {
            drawPixelRect(x, y + 18, 4, 8, hair);
            drawPixelRect(x + 2, y + 26, 4, 4, skin);
            drawPixelRect(x + 8, y + 18, 4, 8, hair);
            drawPixelRect(x + 8, y + 26, 4, 4, skin);
        } else if (frame === 2) {
            drawPixelRect(x + 2, y + 18, 4, 8, hair);
            drawPixelRect(x + 2, y + 26, 4, 4, skin);
            drawPixelRect(x + 6, y + 18, 4, 8, hair);
            drawPixelRect(x + 6, y + 26, 4, 4, skin);
        } else {
            drawPixelRect(x + 2, y + 18, 4, 8, hair);
            drawPixelRect(x + 2, y + 26, 4, 4, skin);
            drawPixelRect(x + 8, y + 18, 4, 8, hair);
            drawPixelRect(x + 8, y + 26, 4, 4, skin);
        }
    } else {
        // Small Mario
        // Hat
        drawPixelRect(x + 2, y, 7, 3, main);
        drawPixelRect(x + 1, y + 1, 9, 2, main);
        // Face
        drawPixelRect(x + 1, y + 3, 9, 4, skin);
        drawPixelRect(x + 7, y + 4, 3, 2, hair);
        drawPixelRect(x + 2, y + 3, 2, 2, '#000');
        // Body
        drawPixelRect(x + 2, y + 7, 8, 4, main);
        drawPixelRect(x + 4, y + 8, 4, 2, skin);
        // Legs
        if (jumping) {
            drawPixelRect(x, y + 11, 4, 3, hair);
            drawPixelRect(x + 8, y + 11, 4, 3, hair);
            drawPixelRect(x + 10, y + 13, 3, 2, skin);
        } else if (frame === 1) {
            drawPixelRect(x, y + 11, 4, 4, hair);
            drawPixelRect(x + 8, y + 11, 4, 4, hair);
        } else if (frame === 2) {
            drawPixelRect(x + 2, y + 11, 4, 4, hair);
            drawPixelRect(x + 6, y + 11, 4, 4, hair);
        } else {
            drawPixelRect(x + 2, y + 11, 4, 4, hair);
            drawPixelRect(x + 7, y + 11, 4, 4, hair);
        }
    }
    
    ctx.restore();
}

function drawWalkingMario(x, y, facing, frame, big, fire) {
    drawMarioSprite(x, y, facing, frame, big, fire, false, false);
}

function drawJumpingMario(x, y, facing, big, fire) {
    drawMarioSprite(x, y, facing, 0, big, fire, true, false);
}

function drawCrouchingMario(x, y, facing, big, fire) {
    drawMarioSprite(x, y, facing, 0, big, fire, false, true);
}

function drawDeadMario(x, y) {
    const skin = COLORS.marioSkin;
    const main = COLORS.mario;
    const hair = COLORS.marioHair;
    
    // Hat
    drawPixelRect(x + 2, y, 7, 3, main);
    // Face (X eyes for dead)
    drawPixelRect(x + 1, y + 3, 9, 4, skin);
    drawPixelRect(x + 2, y + 3, 2, 2, '#000');
    drawPixelRect(x + 7, y + 3, 2, 2, '#000');
    // Body
    drawPixelRect(x + 2, y + 7, 8, 4, main);
    // Legs
    drawPixelRect(x + 2, y + 11, 4, 4, hair);
    drawPixelRect(x + 7, y + 11, 4, 4, hair);
}

function drawGoomba(x, y, frame) {
    // Body
    drawPixelRect(x + 2, y + 2, 12, 8, COLORS.goomba);
    drawPixelRect(x + 4, y, 8, 2, COLORS.goomba);
    // Eyes
    drawPixelRect(x + 4, y + 4, 3, 3, '#FFF');
    drawPixelRect(x + 9, y + 4, 3, 3, '#FFF');
    drawPixelRect(x + 5, y + 5, 2, 2, '#000');
    drawPixelRect(x + 10, y + 5, 2, 2, '#000');
    // Feet
    if (frame === 0) {
        drawPixelRect(x, y + 10, 5, 6, COLORS.goombaDark);
        drawPixelRect(x + 11, y + 10, 5, 6, COLORS.goombaDark);
    } else {
        drawPixelRect(x + 1, y + 10, 5, 6, COLORS.goombaDark);
        drawPixelRect(x + 10, y + 10, 5, 6, COLORS.goombaDark);
    }
}

function drawSquishedGoomba(x, y) {
    drawPixelRect(x + 1, y + 12, 14, 4, COLORS.goomba);
    drawPixelRect(x + 3, y + 10, 10, 2, COLORS.goombaDark);
}

function drawKoopa(x, y, frame) {
    // Shell
    drawPixelRect(x + 2, y + 8, 12, 12, COLORS.koopa);
    drawPixelRect(x + 4, y + 6, 8, 4, COLORS.koopa);
    drawPixelRect(x + 4, y + 10, 8, 8, COLORS.koopaDark);
    // Head
    drawPixelRect(x + (frame === 0 ? 0 : 2), y + 2, 8, 8, COLORS.koopa);
    drawPixelRect(x + (frame === 0 ? 2 : 4), y + 4, 3, 3, '#FFF');
    drawPixelRect(x + (frame === 0 ? 3 : 5), y + 5, 2, 2, '#000');
    // Feet
    drawPixelRect(x + 2, y + 20, 4, 4, '#FCB838');
    drawPixelRect(x + 10, y + 20, 4, 4, '#FCB838');
}

function drawKoopaShell(x, y) {
    drawPixelRect(x + 2, y + 2, 12, 12, COLORS.koopa);
    drawPixelRect(x + 4, y + 4, 8, 8, COLORS.koopaDark);
    drawPixelRect(x + 6, y + 6, 4, 4, '#80D010');
}

function drawMushroom(x, y, frame) {
    // Moon body (circular shape)
    drawPixelRect(x + 2, y, 12, 16, '#C8C8C8');
    drawPixelRect(x + 4, y - 2, 8, 2, '#C8C8C8');
    drawPixelRect(x + 0, y + 2, 16, 12, '#C8C8C8');
    // Moon highlight
    drawPixelRect(x + 4, y + 2, 4, 4, '#E8E8E8');
    // Craters
    drawPixelRect(x + 3, y + 3, 3, 3, '#A0A0A0');
    drawPixelRect(x + 9, y + 5, 4, 4, '#A0A0A0');
    drawPixelRect(x + 5, y + 9, 3, 3, '#A0A0A0');
    drawPixelRect(x + 11, y + 10, 2, 2, '#A0A0A0');
    // Crater shadows
    drawPixelRect(x + 4, y + 4, 1, 1, '#808080');
    drawPixelRect(x + 10, y + 6, 1, 1, '#808080');
    // Glow effect
    drawPixelRect(x + 1, y + 1, 1, 1, '#FFFF80');
    drawPixelRect(x + 14, y + 3, 1, 1, '#FFFF80');
    // Feet animation
    if (frame === 0) {
        drawPixelRect(x + 2, y + 14, 4, 2, '#808080');
        drawPixelRect(x + 10, y + 14, 4, 2, '#808080');
    } else {
        drawPixelRect(x + 4, y + 14, 4, 2, '#808080');
        drawPixelRect(x + 8, y + 14, 4, 2, '#808080');
    }
}
}

function drawCoin(x, y) {
    drawPixelRect(x + 2, y, 4, 14, COLORS.coin);
    drawPixelRect(x + 1, y + 2, 6, 10, COLORS.coin);
    drawPixelRect(x + 3, y + 4, 2, 6, COLORS.coinDark);
}

function drawCoinAnimation(x, y, frame) {
    const widths = [8, 6, 2, 6];
    const w = widths[frame];
    const offset = (8 - w) / 2;
    drawPixelRect(x + offset, y, w, 14, COLORS.coin);
    if (w > 3) {
        drawPixelRect(x + offset + 1, y + 2, w - 2, 10, COLORS.coinDark);
    }
}

function drawStar(x, y, frame) {
    const colors = ['#FCFCFC', '#FCB838', '#E44040', '#80D010'];
    const color = colors[frame];
    // Star shape
    drawPixelRect(x + 6, y, 4, 4, color);
    drawPixelRect(x + 4, y + 4, 8, 4, color);
    drawPixelRect(x + 2, y + 8, 12, 4, color);
    drawPixelRect(x + 4, y + 12, 8, 4, color);
    // Eyes
    drawPixelRect(x + 5, y + 6, 2, 2, '#000');
    drawPixelRect(x + 9, y + 6, 2, 2, '#000');
}

function drawTile(x, y, tile) {
    const screenX = x * TILE_SIZE - cameraX;
    const screenY = y * TILE_SIZE;
    
    if (screenX < -TILE_SIZE || screenX > SCREEN_WIDTH + TILE_SIZE) return;
    
    const key = `${x},${y}`;
    let offsetY = 0;
    if (blockHitAnim[key]) {
        const anim = blockHitAnim[key];
        if (anim.timer > 3) {
            offsetY = -(anim.timer - 3) * 4;
        } else {
            offsetY = -anim.timer * 4;
        }
    }
    
    const sy = screenY + offsetY;
    
    switch(tile) {
        case TILES.GROUND:
            drawPixelRect(screenX, sy, TILE_SIZE, TILE_SIZE, COLORS.ground);
            drawPixelRect(screenX + 1, sy + 1, 6, 6, COLORS.groundDark);
            drawPixelRect(screenX + 9, sy + 1, 6, 6, COLORS.groundDark);
            drawPixelRect(screenX + 1, sy + 9, 14, 6, COLORS.groundDark);
            break;
            
        case TILES.BRICK:
            drawPixelRect(screenX, sy, TILE_SIZE, TILE_SIZE, COLORS.brick);
            drawPixelRect(screenX, sy, TILE_SIZE, 1, COLORS.brickLine);
            drawPixelRect(screenX, sy, 1, TILE_SIZE, COLORS.brickLine);
            drawPixelRect(screenX + 7, sy, 1, 7, COLORS.brickDark);
            drawPixelRect(screenX, sy + 7, TILE_SIZE, 1, COLORS.brickDark);
            drawPixelRect(screenX + 3, sy + 8, 1, 8, COLORS.brickDark);
            drawPixelRect(screenX + 11, sy + 8, 1, 8, COLORS.brickDark);
            break;
            
        case TILES.QUESTION:
            drawPixelRect(screenX, sy, TILE_SIZE, TILE_SIZE, COLORS.question);
            drawPixelRect(screenX, sy, TILE_SIZE, 1, '#FCBC38');
            drawPixelRect(screenX, sy, 1, TILE_SIZE, '#FCBC38');
            drawPixelRect(screenX + 15, sy, 1, TILE_SIZE, COLORS.questionDark);
            drawPixelRect(screenX, sy + 15, TILE_SIZE, 1, COLORS.questionDark);
            // Question mark
            drawPixelRect(screenX + 6, sy + 3, 4, 2, COLORS.questionDark);
            drawPixelRect(screenX + 8, sy + 5, 2, 3, COLORS.questionDark);
            drawPixelRect(screenX + 7, sy + 8, 2, 2, COLORS.questionDark);
            drawPixelRect(screenX + 7, sy + 11, 2, 2, COLORS.questionDark);
            break;
            
        case TILES.USED_BLOCK:
            drawPixelRect(screenX, sy, TILE_SIZE, TILE_SIZE, '#886850');
            drawPixelRect(screenX, sy, TILE_SIZE, 1, '#A08060');
            drawPixelRect(screenX, sy, 1, TILE_SIZE, '#A08060');
            drawPixelRect(screenX + 15, sy, 1, TILE_SIZE, '#604838');
            drawPixelRect(screenX, sy + 15, TILE_SIZE, 1, '#604838');
            break;
            
        case TILES.PIPE_TL:
            drawPixelRect(screenX, sy, TILE_SIZE, TILE_SIZE, COLORS.pipe);
            drawPixelRect(screenX, sy, 2, TILE_SIZE, COLORS.pipeLight);
            drawPixelRect(screenX + 14, sy, 2, TILE_SIZE, COLORS.pipeDark);
            drawPixelRect(screenX + 2, sy, 12, 2, COLORS.pipeLight);
            break;
            
        case TILES.PIPE_TR:
            drawPixelRect(screenX, sy, TILE_SIZE, TILE_SIZE, COLORS.pipe);
            drawPixelRect(screenX, sy, 2, TILE_SIZE, COLORS.pipeLight);
            drawPixelRect(screenX + 14, sy, 2, TILE_SIZE, COLORS.pipeDark);
            drawPixelRect(screenX + 2, sy, 12, 2, COLORS.pipeLight);
            break;
            
        case TILES.PIPE_BL:
            drawPixelRect(screenX, sy, TILE_SIZE, TILE_SIZE, COLORS.pipe);
            drawPixelRect(screenX, sy, 2, TILE_SIZE, COLORS.pipeLight);
            drawPixelRect(screenX + 14, sy, 2, TILE_SIZE, COLORS.pipeDark);
            break;
            
        case TILES.PIPE_BR:
            drawPixelRect(screenX, sy, TILE_SIZE, TILE_SIZE, COLORS.pipe);
            drawPixelRect(screenX, sy, 2, TILE_SIZE, COLORS.pipeLight);
            drawPixelRect(screenX + 14, sy, 2, TILE_SIZE, COLORS.pipeDark);
            break;
            
        case TILES.HARD_BLOCK:
            drawPixelRect(screenX, sy, TILE_SIZE, TILE_SIZE, '#888888');
            drawPixelRect(screenX, sy, TILE_SIZE, 1, '#AAAAAA');
            drawPixelRect(screenX, sy, 1, TILE_SIZE, '#AAAAAA');
            drawPixelRect(screenX + 15, sy, 1, TILE_SIZE, '#666666');
            drawPixelRect(screenX, sy + 15, TILE_SIZE, 1, '#666666');
            drawPixelRect(screenX + 2, sy + 2, 12, 12, '#888888');
            break;
    }
}

function drawBackground() {
    // Sky
    ctx.fillStyle = COLORS.sky;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // Clouds
    const cloudPositions = [
        {x: 8, y: 2, w: 3}, {x: 19, y: 1, w: 1}, {x: 27, y: 2, w: 2},
        {x: 36, y: 1, w: 2}, {x: 56, y: 2, w: 3}, {x: 67, y: 1, w: 1},
        {x: 75, y: 2, w: 2}, {x: 84, y: 1, w: 2}, {x: 104, y: 2, w: 3},
        {x: 115, y: 1, w: 1}, {x: 123, y: 2, w: 2}, {x: 132, y: 1, w: 2},
        {x: 152, y: 2, w: 3}, {x: 163, y: 1, w: 1}, {x: 171, y: 2, w: 2},
    ];
    
    for (let cloud of cloudPositions) {
        const cx = cloud.x * TILE_SIZE - cameraX;
        const cy = cloud.y * TILE_SIZE;
        if (cx > -48 && cx < SCREEN_WIDTH + 48) {
            drawCloud(cx, cy, cloud.w);
        }
    }
    
    // Hills
    const hillPositions = [
        {x: 0, size: 3}, {x: 16, size: 1}, {x: 48, size: 3}, {x: 64, size: 1},
        {x: 96, size: 3}, {x: 112, size: 1}, {x: 144, size: 3}, {x: 160, size: 1},
    ];
    
    for (let hill of hillPositions) {
        const hx = hill.x * TILE_SIZE - cameraX;
        if (hx > -64 && hx < SCREEN_WIDTH + 64) {
            drawHill(hx, 13 * TILE_SIZE, hill.size);
        }
    }
    
    // Bushes
    const bushPositions = [
        {x: 11, size: 3}, {x: 23, size: 1}, {x: 41, size: 2}, {x: 59, size: 3},
        {x: 71, size: 1}, {x: 89, size: 2}, {x: 107, size: 3}, {x: 119, size: 1},
    ];
    
    for (let bush of bushPositions) {
        const bx = bush.x * TILE_SIZE - cameraX;
        if (bx > -48 && bx < SCREEN_WIDTH + 48) {
            drawBush(bx, 13 * TILE_SIZE - 8, bush.size);
        }
    }
}

function drawCloud(x, y, size) {
    const w = size * 16;
    ctx.fillStyle = COLORS.cloud;
    // Simple cloud shape
    ctx.beginPath();
    ctx.arc(x + 8, y + 12, 8, 0, Math.PI * 2);
    ctx.arc(x + 24, y + 8, 10, 0, Math.PI * 2);
    ctx.arc(x + 40, y + 12, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x + 8, y + 12, 32, 8);
}

function drawHill(x, y, size) {
    const h = size * 16;
    ctx.fillStyle = COLORS.hill;
    ctx.beginPath();
    ctx.moveTo(x - h, y);
    ctx.lineTo(x, y - h);
    ctx.lineTo(x + h, y);
    ctx.fill();
    
    ctx.fillStyle = COLORS.hillDark;
    ctx.beginPath();
    ctx.moveTo(x - h/2, y);
    ctx.lineTo(x, y - h + 4);
    ctx.lineTo(x + h/2, y);
    ctx.fill();
}

function drawBush(x, y, size) {
    const w = size * 12;
    ctx.fillStyle = COLORS.bush;
    ctx.beginPath();
    ctx.arc(x + 8, y + 6, 8, 0, Math.PI * 2);
    ctx.arc(x + 20, y + 4, 10, 0, Math.PI * 2);
    ctx.arc(x + 32, y + 6, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x + 8, y + 6, 24, 6);
}

function drawCastle(x, y) {
    // Main body
    drawPixelRect(x, y - 48, 64, 48, COLORS.castle);
    drawPixelRect(x + 2, y - 46, 60, 44, COLORS.castleDark);
    
    // Door
    drawPixelRect(x + 24, y - 24, 16, 24, '#000');
    drawPixelRect(x + 26, y - 22, 12, 20, '#404040');
    
    // Windows
    drawPixelRect(x + 10, y - 40, 8, 8, '#000');
    drawPixelRect(x + 46, y - 40, 8, 8, '#000');
    
    // Battlements
    for (let i = 0; i < 5; i++) {
        drawPixelRect(x + i * 14, y - 56, 8, 8, COLORS.castle);
    }
    
    // Tower
    drawPixelRect(x + 24, y - 72, 16, 24, COLORS.castle);
    drawPixelRect(x + 26, y - 70, 12, 20, COLORS.castleDark);
    drawPixelRect(x + 24, y - 80, 16, 8, COLORS.castle);
}

function drawFlagpole(x, y) {
    // Pole
    drawPixelRect(x + 6, y - 96, 2, 96, COLORS.flagPole);
    // Ball on top
    drawPixelRect(x + 4, y - 100, 6, 6, '#80D010');
    // Flag
    drawPixelRect(x + 8, y - 92, 16, 12, COLORS.flag);
    drawPixelRect(x + 10, y - 88, 4, 4, '#FFF');
}

function drawUI() {
    ctx.fillStyle = COLORS.text;
    ctx.font = '8px monospace';
    
    // Mario
    ctx.fillText('MARIO', 20, 12);
    ctx.fillText(score.toString().padStart(6, '0'), 20, 22);
    
    // Coins
    ctx.fillText('×' + coins.toString().padStart(2, '0'), 96, 22);
    // Coin icon
    drawPixelRect(86, 16, 6, 8, COLORS.coin);
    
    // World
    ctx.fillText('WORLD', 140, 12);
    ctx.fillText('1-1', 148, 22);
    
    // Time
    ctx.fillText('TIME', 200, 12);
    ctx.fillText(time.toString(), 204, 22);
    
    // Lives
    ctx.fillText('×' + lives, 20, 32);
    drawPixelRect(10, 26, 8, 8, COLORS.mario);
}

function drawTitleScreen() {
    ctx.fillStyle = COLORS.sky;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // Ground
    for (let x = 0; x < SCREEN_WIDTH; x += TILE_SIZE) {
        drawPixelRect(x, SCREEN_HEIGHT - 32, TILE_SIZE, TILE_SIZE, COLORS.ground);
        drawPixelRect(x, SCREEN_HEIGHT - 16, TILE_SIZE, TILE_SIZE, COLORS.ground);
    }
    
    // Title
    ctx.fillStyle = COLORS.mario;
    ctx.font = 'bold 20px monospace';
    ctx.fillText('SUPER', 80, 60);
    ctx.fillStyle = COLORS.question;
    ctx.fillText('MARIO BROS.', 40, 85);
    
    // Copyright
    ctx.fillStyle = COLORS.text;
    ctx.font = '8px monospace';
    ctx.fillText('© 1985 NINTENDO', 70, 140);
    
    // Start prompt
    if (Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.fillText('PRESS SPACE TO START', 50, 170);
    }
    
    // Controls
    ctx.fillText('ARROW KEYS: MOVE', 60, 195);
    ctx.fillText('SPACE: JUMP', 75, 210);
    ctx.fillText('SHIFT: RUN', 80, 225);
}

function drawGameOver() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    ctx.fillStyle = COLORS.text;
    ctx.font = '16px monospace';
    ctx.fillText('GAME OVER', 70, 100);
    
    ctx.font = '10px monospace';
    ctx.fillText('SCORE: ' + score, 80, 140);
    
    if (Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.fillText('PRESS SPACE', 75, 180);
    }
}

function drawWinScreen() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    ctx.fillStyle = COLORS.text;
    ctx.font = '14px monospace';
    ctx.fillText('THANK YOU MARIO!', 50, 80);
    ctx.fillText('BUT OUR PRINCESS IS IN', 35, 110);
    ctx.fillText('ANOTHER CASTLE!', 55, 130);
    
    ctx.font = '10px monospace';
    ctx.fillText('SCORE: ' + score, 80, 170);
    
    if (Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.fillText('PRESS SPACE', 75, 200);
    }
}

function updateBlockAnimations() {
    for (let key in blockHitAnim) {
        blockHitAnim[key].timer--;
        if (blockHitAnim[key].timer <= 0) {
            delete blockHitAnim[key];
        }
    }
}

function updateCamera() {
    const targetX = mario.x - SCREEN_WIDTH / 3;
    cameraX = Math.max(0, Math.min(targetX, level.width * TILE_SIZE - SCREEN_WIDTH));
}

function updateTime() {
    if (mario.dead || mario.winning || levelComplete) return;
    
    timeCounter++;
    if (timeCounter >= 24) {
        timeCounter = 0;
        time--;
        if (time <= 0) {
            mario.die();
        }
    }
}

function startGame() {
    gameState = 'playing';
    initLevel();
    score = 0;
    coins = 0;
    lives = 3;
    time = 400;
    timeCounter = 0;
    levelComplete = false;
    deathAnimation = false;
}

function resetGame() {
    gameState = 'title';
}

function gameLoop() {
    // Update
    if (gameState === 'playing') {
        if (deathAnimation) {
            deathTimer++;
            mario.update();
            if (deathTimer > 120) {
                deathAnimation = false;
                lives--;
                if (lives <= 0) {
                    gameState = 'gameover';
                    playSound('gameover');
                } else {
                    initLevel();
                    time = 400;
                }
            }
        } else if (levelComplete && mario.winning) {
            mario.update();
            if (mario.winTimer > 200) {
                gameState = 'win';
            }
        } else {
            mario.update();
            updateCamera();
            updateTime();
            
            for (let enemy of enemies) {
                if (Math.abs(enemy.x - mario.x) < SCREEN_WIDTH + 64) {
                    enemy.update();
                }
            }
            
            for (let item of items) {
                item.update();
            }
            
            for (let particle of particles) {
                particle.update();
            }
            
            for (let popup of scorePopups) {
                popup.update();
            }
            
            particles = particles.filter(p => p.life > 0);
            scorePopups = scorePopups.filter(p => p.life > 0);
            enemies = enemies.filter(e => !e.dead || e.deadTimer < 30);
            
            checkEntityCollisions();
            checkFlagpole();
            updateBlockAnimations();
        }
    }
    
    // Draw
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    if (gameState === 'title') {
        drawTitleScreen();
    } else if (gameState === 'gameover') {
        drawGameOver();
    } else if (gameState === 'win') {
        drawWinScreen();
    } else {
        drawBackground();
        
        // Draw tiles
        const startX = Math.floor(cameraX / TILE_SIZE);
        const endX = Math.min(startX + 17, level.width);
        
        for (let y = 0; y < level.height; y++) {
            for (let x = startX; x < endX; x++) {
                const tile = level.map[y][x];
                if (tile !== TILES.EMPTY) {
                    drawTile(x, y, tile);
                }
            }
        }
        
        // Castle
        const castleX = 198 * TILE_SIZE - cameraX;
        if (castleX > -64 && castleX < SCREEN_WIDTH + 64) {
            drawCastle(castleX, 13 * TILE_SIZE);
        }
        
        // Flagpole
        const flagX = 190 * TILE_SIZE - cameraX;
        if (flagX > -16 && flagX < SCREEN_WIDTH + 16) {
            drawFlagpole(flagX, 13 * TILE_SIZE);
        }
        
        // Draw items
        for (let item of items) {
            item.draw();
        }
        
        // Draw enemies
        for (let enemy of enemies) {
            enemy.draw();
        }
        
        // Draw Mario
        mario.draw();
        
        // Draw particles
        for (let particle of particles) {
            particle.draw();
        }
        
        // Draw score popups
        for (let popup of scorePopups) {
            popup.draw();
        }
        
        // Draw UI
        drawUI();
    }
    
    requestAnimationFrame(gameLoop);
}

// Start game loop
gameLoop();