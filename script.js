// Game State Management
class GameState {
    constructor() {
        this.currentLevel = 'start';
        this.chatProgress = 0;
        this.flightBooked = false;
        this.towerFound = false;
        this.enemiesDefeated = 0;
        this.playerHealth = 100;
        this.gameCompleted = false;
    }
}

const gameState = new GameState();

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    level1: document.getElementById('level1-screen'),
    level2: document.getElementById('level2-screen'),
    level3: document.getElementById('level3-screen'),
    ending: document.getElementById('ending-screen')
};

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

function initializeGame() {
    // Start button
    document.getElementById('start-btn').addEventListener('click', startGame);
    
    // Level 1 - Chat and Flight
    initializeLevel1();
    
    // Level 2 - Tower Quest
    initializeLevel2();
    
    // Level 3 - Battle
    initializeLevel3();
    
    // Ending
    initializeEnding();
    
    // Add floating hearts effect
    createFloatingHearts();
}

function startGame() {
    showScreen('level1');
    gameState.currentLevel = 'level1';
    createSparkleEffect(document.getElementById('start-btn'));
}

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Level 1: Connecting Hearts
function initializeLevel1() {
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    
    // Pre-defined chat conversation
    const chatScript = [
        { sender: 'coco', message: 'Hey beautiful! I miss you so much 💕' },
        { sender: 'bobo', message: 'I miss you too, Coco! When can we meet?' },
        { sender: 'coco', message: 'I\'m stuck in Dubai... there are some mysterious towers here 🏰' },
        { sender: 'bobo', message: 'Don\'t worry! I\'ll come to Dubai and find you!' },
        { sender: 'coco', message: 'Really? That would be amazing! Book a flight soon! ✈️' },
        { sender: 'bobo', message: 'Already on it! Love you! 💖' }
    ];
    
    let currentMessageIndex = 0;
    
    // Start chat automatically
    setTimeout(() => {
        displayNextMessage();
    }, 1000);
    
    function displayNextMessage() {
        if (currentMessageIndex < chatScript.length) {
            const message = chatScript[currentMessageIndex];
            addMessage(message.message, message.sender);
            currentMessageIndex++;
            
            setTimeout(() => {
                displayNextMessage();
            }, 2000);
        } else {
            // Enable flight booking after chat
            setTimeout(() => {
                showFlightBooking();
            }, 1000);
        }
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender === 'bobo' ? 'sent' : 'received'}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add sparkle effect
        createSparkleEffect(messageDiv);
    }
    
    function showFlightBooking() {
        document.getElementById('kittygram-section').classList.remove('active');
        document.getElementById('flight-section').classList.add('active');
        
        // Flight booking logic
        const bookFlightBtn = document.getElementById('book-flight-btn');
        const fromCity = document.getElementById('from-city');
        const toCity = document.getElementById('to-city');
        const flightDate = document.getElementById('flight-date');
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        flightDate.min = today;
        
        bookFlightBtn.addEventListener('click', function() {
            if (fromCity.value === 'delhi' && toCity.value === 'dubai' && flightDate.value) {
                gameState.flightBooked = true;
                createSparkleEffect(bookFlightBtn);
                
                setTimeout(() => {
                    showScreen('level2');
                    gameState.currentLevel = 'level2';
                }, 1000);
            } else {
                alert('Please select Delhi to Dubai and choose a date! 💕');
            }
        });
    }
}

// Level 2: Tower Quest
function initializeLevel2() {
    const towers = document.querySelectorAll('.tower');
    
    towers.forEach((tower, index) => {
        const towerBtn = tower.querySelector('.tower-btn');
        towerBtn.addEventListener('click', function() {
            const towerNumber = tower.dataset.tower;
            
            createSparkleEffect(towerBtn);
            
            if (towerNumber === '2') { // Golden Castle is correct
                setTimeout(() => {
                    alert('You found Coco! But he\'s guarded by enemies! 💕');
                    gameState.towerFound = true;
                    showScreen('level3');
                    gameState.currentLevel = 'level3';
                }, 500);
            } else {
                setTimeout(() => {
                    alert('This tower is empty... try another one! 🏰');
                }, 500);
            }
        });
    });
}

// Level 3: Battle for Love
function initializeLevel3() {
    const battleBtns = document.querySelectorAll('.battle-btn');
    const enemies = document.querySelectorAll('.enemy');
    let currentEnemyIndex = 0;
    
    battleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = btn.dataset.action;
            performBattleAction(action);
            createSparkleEffect(btn);
        });
    });
    
    function performBattleAction(action) {
        const currentEnemy = enemies[currentEnemyIndex];
        if (!currentEnemy) return;
        
        const enemyHealthBar = currentEnemy.querySelector('.health');
        let currentHealth = parseInt(enemyHealthBar.style.width) || 100;
        
        switch (action) {
            case 'attack':
                currentHealth -= 30;
                break;
            case 'heal':
                const playerHealthBar = document.getElementById('player-health');
                let playerHealth = parseInt(playerHealthBar.style.width) || 100;
                playerHealth = Math.min(100, playerHealth + 20);
                playerHealthBar.style.width = playerHealth + '%';
                return;
            case 'special':
                currentHealth -= 50;
                break;
        }
        
        enemyHealthBar.style.width = Math.max(0, currentHealth) + '%';
        
        if (currentHealth <= 0) {
            // Enemy defeated
            currentEnemy.style.opacity = '0.3';
            gameState.enemiesDefeated++;
            currentEnemyIndex++;
            
            if (gameState.enemiesDefeated >= 3) {
                // All enemies defeated
                setTimeout(() => {
                    showScreen('ending');
                    gameState.currentLevel = 'ending';
                    gameState.gameCompleted = true;
                }, 1000);
            }
        } else {
            // Enemy attacks back
            setTimeout(() => {
                const playerHealthBar = document.getElementById('player-health');
                let playerHealth = parseInt(playerHealthBar.style.width) || 100;
                playerHealth -= 15;
                playerHealthBar.style.width = Math.max(0, playerHealth) + '%';
                
                if (playerHealth <= 0) {
                    alert('Game Over! Try again! 💔');
                    location.reload();
                }
            }, 1000);
        }
    }
}

// Ending Screen
function initializeEnding() {
    const kissBtn = document.getElementById('kiss-btn');
    const restartBtn = document.getElementById('restart-btn');
    
    kissBtn.addEventListener('click', function() {
        createKissScene();
        createSparkleEffect(kissBtn);
    });
    
    restartBtn.addEventListener('click', function() {
        location.reload();
    });
}

function createKissScene() {
    const reunionScene = document.querySelector('.reunion-scene');
    
    // Add kiss animation
    reunionScene.style.transform = 'scale(1.1)';
    reunionScene.style.transition = 'transform 0.5s ease';
    
    // Create heart explosion
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createHeartParticle(
                reunionScene.offsetLeft + reunionScene.offsetWidth / 2,
                reunionScene.offsetTop + reunionScene.offsetHeight / 2
            );
        }, i * 100);
    }
    
    // Start fireworks
    setTimeout(() => {
        createFireworks();
    }, 1000);
    
    // Show celebration message
    setTimeout(() => {
        alert('💕 Happy Birthday and Happy Diwali! 🎉✨');
    }, 2000);
}

// Special Effects
function createSparkleEffect(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}

function createHeartParticle(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = '💕';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    
    // Random horizontal movement
    heart.style.transform = `translateX(${(Math.random() - 0.5) * 200}px)`;
    
    document.getElementById('particles-container').appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 3000);
}

function createFloatingHearts() {
    setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight + 50;
        createHeartParticle(x, y);
    }, 2000);
}

function createFireworks() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight * 0.6);
            
            // Create firework burst
            for (let j = 0; j < 12; j++) {
                const particle = document.createElement('div');
                particle.className = 'firework';
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                
                const angle = (j / 12) * Math.PI * 2;
                const distance = 50 + Math.random() * 100;
                const endX = x + Math.cos(angle) * distance;
                const endY = y + Math.sin(angle) * distance;
                
                particle.style.setProperty('--end-x', endX + 'px');
                particle.style.setProperty('--end-y', endY + 'px');
                
                document.getElementById('fireworks-container').appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 1500);
            }
        }, i * 300);
    }
}

// Keyboard Controls
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const messageInput = document.getElementById('message-input');
        if (messageInput && document.activeElement === messageInput) {
            document.getElementById('send-btn').click();
        }
    }
});

// Mobile Touch Events
document.addEventListener('touchstart', function(event) {
    // Add touch feedback for mobile devices
    if (event.target.classList.contains('game-btn') || 
        event.target.classList.contains('battle-btn') || 
        event.target.classList.contains('tower-btn')) {
        event.target.style.transform = 'scale(0.95)';
    }
});

document.addEventListener('touchend', function(event) {
    if (event.target.classList.contains('game-btn') || 
        event.target.classList.contains('battle-btn') || 
        event.target.classList.contains('tower-btn')) {
        setTimeout(() => {
            event.target.style.transform = '';
        }, 150);
    }
});

// Window Resize Handler
window.addEventListener('resize', function() {
    // Adjust particle effects for new window size
    const particles = document.querySelectorAll('.heart-particle');
    particles.forEach(particle => {
        if (parseInt(particle.style.left) > window.innerWidth) {
            particle.remove();
        }
    });
});

// Game Audio (Optional - using Web Audio API for sound effects)
class GameAudio {
    constructor() {
        this.audioContext = null;
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playHeartSound() {
        this.playTone(800, 0.2);
        setTimeout(() => this.playTone(600, 0.2), 100);
    }
    
    playVictorySound() {
        const notes = [523, 659, 784, 1047]; // C, E, G, C
        notes.forEach((note, index) => {
            setTimeout(() => this.playTone(note, 0.3), index * 150);
        });
    }
}

const gameAudio = new GameAudio();

// Add sound effects to interactions
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('game-btn') || 
        event.target.classList.contains('battle-btn') || 
        event.target.classList.contains('tower-btn')) {
        gameAudio.playHeartSound();
    }
});

// Easter Eggs and Hidden Features
let clickCount = 0;
document.addEventListener('click', function() {
    clickCount++;
    
    // Secret heart shower after many clicks
    if (clickCount % 50 === 0) {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createHeartParticle(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                );
            }, i * 100);
        }
    }
});

// Konami Code Easter Egg
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(event) {
    konamiCode.push(event.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Activate super love mode
        document.body.style.filter = 'hue-rotate(45deg) saturate(1.5)';
        createFireworks();
        alert('💕 Super Love Mode Activated! 💕');
        konamiCode = [];
    }
});

console.log('💕 Coco & Bobo: Long Distance Love Game loaded successfully! 💕');
console.log('🎮 Enjoy the romantic adventure! 🎮');