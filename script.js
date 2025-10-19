// Game State Management
class LoveGame {
    constructor() {
        this.currentLevel = 1;
        this.lovePoints = 0;
        this.gameState = {
            chatMessages: 0,
            flightBooked: false,
            castleFound: false,
            enemiesDefeated: 0,
            totalEnemies: 1
        };
        this.battleStats = {
            playerHealth: 100,
            enemyHealth: 100
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createFloatingHearts();
        this.updateUI();
    }

    setupEventListeners() {
        // Start game button
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });

        // Level 1 - Chat system
        document.getElementById('send-message').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Level 1 - Flight booking
        document.querySelectorAll('.book-flight').forEach(button => {
            button.addEventListener('click', (e) => {
                this.bookFlight(e.target.closest('.flight-option'));
            });
        });

        // Level 2 - Castle selection
        document.querySelectorAll('.castle').forEach(castle => {
            castle.addEventListener('click', (e) => {
                this.selectCastle(castle);
            });
        });

        // Level 3 - Battle actions
        document.getElementById('attack-btn').addEventListener('click', () => {
            this.attack();
        });

        document.getElementById('heal-btn').addEventListener('click', () => {
            this.heal();
        });

        document.getElementById('special-btn').addEventListener('click', () => {
            this.specialAttack();
        });
    }

    startGame() {
        this.showScreen('level1');
        this.addLovePoints(10);
        this.createSparkles(document.getElementById('start-game'));
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.updateLevelIndicator();
    }

    updateLevelIndicator() {
        const levelNames = {
            'level1': 'Level 1: Connecting Hearts',
            'level2': 'Level 2: The Tower Quest',
            'level3': 'Level 3: Battle for Love',
            'ending': 'Birthday Celebration'
        };
        document.getElementById('current-level').textContent = levelNames[this.currentLevel === 1 ? 'level1' : 
                                                                    this.currentLevel === 2 ? 'level2' :
                                                                    this.currentLevel === 3 ? 'level3' : 'ending'];
    }

    // Level 1: Chat System
    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'bobo');
            input.value = '';
            this.gameState.chatMessages++;
            this.addLovePoints(5);
            
            // Auto-reply from Coco
            setTimeout(() => {
                const replies = [
                    "I love you too, Bobo! 💕",
                    "You're so sweet! I can't wait to see you! 😘",
                    "My heart beats only for you! 💖",
                    "You make me so happy! ✨",
                    "I'm counting the days until we meet! 💕"
                ];
                const randomReply = replies[Math.floor(Math.random() * replies.length)];
                this.addMessage(randomReply, 'coco');
                
                if (this.gameState.chatMessages >= 3 && !this.gameState.flightBooked) {
                    this.addMessage("I miss you so much! When are you coming to Dubai? ✈️", 'coco');
                }
            }, 1000);
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar ${sender}-avatar"></div>
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Level 1: Flight Booking
    bookFlight(flightOption) {
        if (this.gameState.flightBooked) return;
        
        this.gameState.flightBooked = true;
        this.addLovePoints(20);
        
        // Visual feedback
        flightOption.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        flightOption.style.color = 'white';
        flightOption.querySelector('.book-flight').textContent = 'Booked! ✈️';
        flightOption.querySelector('.book-flight').disabled = true;
        
        this.createSparkles(flightOption);
        
        // Add confirmation message
        this.addMessage("I just booked my flight to Dubai! I'm coming to see you! ✈️💕", 'bobo');
        
        setTimeout(() => {
            this.addMessage("That's amazing! I'll be waiting for you at the airport! 🥰", 'coco');
        }, 1500);
        
        // Progress to next level after delay
        setTimeout(() => {
            this.nextLevel();
        }, 3000);
    }

    // Level 2: Castle Selection
    selectCastle(castle) {
        const isCorrect = castle.dataset.correct === 'true';
        
        if (isCorrect) {
            this.gameState.castleFound = true;
            this.addLovePoints(30);
            
            castle.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            castle.style.color = 'white';
            castle.style.transform = 'scale(1.05)';
            
            this.createSparkles(castle);
            
            // Show success message
            const clueBox = document.querySelector('.clue-box');
            clueBox.innerHTML = '<p><strong>🎉 Correct! You found Coco\'s castle! 💕</strong></p>';
            clueBox.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            clueBox.style.color = 'white';
            
            setTimeout(() => {
                this.nextLevel();
            }, 2000);
        } else {
            this.addLovePoints(-5);
            castle.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
            castle.style.color = 'white';
            
            setTimeout(() => {
                castle.style.background = 'white';
                castle.style.color = 'black';
            }, 1000);
        }
    }

    // Level 3: Battle System
    attack() {
        const damage = Math.floor(Math.random() * 20) + 10;
        this.battleStats.enemyHealth = Math.max(0, this.battleStats.enemyHealth - damage);
        this.updateBattleUI();
        
        // Enemy counter-attack
        setTimeout(() => {
            const enemyDamage = Math.floor(Math.random() * 15) + 5;
            this.battleStats.playerHealth = Math.max(0, this.battleStats.playerHealth - enemyDamage);
            this.updateBattleUI();
        }, 500);
        
        this.checkBattleEnd();
    }

    heal() {
        if (this.battleStats.playerHealth < 100) {
            const healAmount = Math.floor(Math.random() * 20) + 10;
            this.battleStats.playerHealth = Math.min(100, this.battleStats.playerHealth + healAmount);
            this.updateBattleUI();
            this.addLovePoints(5);
        }
    }

    specialAttack() {
        const damage = Math.floor(Math.random() * 30) + 20;
        this.battleStats.enemyHealth = Math.max(0, this.battleStats.enemyHealth - damage);
        this.updateBattleUI();
        this.addLovePoints(10);
        
        // Create special effect
        this.createSparkles(document.querySelector('.enemy'));
        
        // Enemy counter-attack
        setTimeout(() => {
            const enemyDamage = Math.floor(Math.random() * 10) + 5;
            this.battleStats.playerHealth = Math.max(0, this.battleStats.playerHealth - enemyDamage);
            this.updateBattleUI();
        }, 500);
        
        this.checkBattleEnd();
    }

    updateBattleUI() {
        const playerHealthBar = document.getElementById('player-health');
        const enemyHealthBar = document.querySelector('.enemy .health-fill');
        
        playerHealthBar.style.width = `${this.battleStats.playerHealth}%`;
        enemyHealthBar.style.width = `${this.battleStats.enemyHealth}%`;
    }

    checkBattleEnd() {
        if (this.battleStats.enemyHealth <= 0) {
            this.gameState.enemiesDefeated++;
            this.addLovePoints(50);
            
            // Show victory
            const enemy = document.querySelector('.enemy');
            enemy.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            enemy.querySelector('.enemy-avatar').style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            
            setTimeout(() => {
                this.nextLevel();
            }, 2000);
        } else if (this.battleStats.playerHealth <= 0) {
            // Game over - restart battle
            this.battleStats.playerHealth = 100;
            this.battleStats.enemyHealth = 100;
            this.updateBattleUI();
            this.addLovePoints(-10);
        }
    }

    // Game Progression
    nextLevel() {
        this.currentLevel++;
        
        if (this.currentLevel === 2) {
            this.showScreen('level2');
        } else if (this.currentLevel === 3) {
            this.showScreen('level3');
        } else if (this.currentLevel === 4) {
            this.showEnding();
        }
    }

    showEnding() {
        this.showScreen('ending');
        this.addLovePoints(100);
        
        // Trigger kiss scene
        setTimeout(() => {
            document.getElementById('kiss-scene').classList.add('active');
            this.createFireworks();
        }, 2000);
        
        // Show celebration messages
        setTimeout(() => {
            this.showCelebrationMessages();
        }, 4000);
    }

    showCelebrationMessages() {
        const messages = [
            "Happy Birthday, my love! 🎂",
            "May our love shine brighter than Diwali fireworks! ✨",
            "You are my everything, Coco! 💕",
            "Here's to many more birthdays together! 🥂",
            "I love you more than words can express! 💖"
        ];
        
        let messageIndex = 0;
        const showNextMessage = () => {
            if (messageIndex < messages.length) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'celebration-message';
                messageDiv.textContent = messages[messageIndex];
                messageDiv.style.cssText = `
                    background: linear-gradient(135deg, #ff6b9d, #ff8fab);
                    color: white;
                    padding: 15px 25px;
                    margin: 10px auto;
                    border-radius: 25px;
                    max-width: 400px;
                    text-align: center;
                    animation: slideIn 0.5s ease;
                `;
                document.querySelector('.celebration-messages').appendChild(messageDiv);
                messageIndex++;
                setTimeout(showNextMessage, 2000);
            }
        };
        
        showNextMessage();
    }

    // Love Points System
    addLovePoints(points) {
        this.lovePoints = Math.max(0, this.lovePoints + points);
        this.updateUI();
        
        if (points > 0) {
            this.createSparkles(document.querySelector('.love-meter'));
        }
    }

    updateUI() {
        const loveFill = document.getElementById('love-fill');
        const percentage = Math.min(100, (this.lovePoints / 200) * 100);
        loveFill.style.width = `${percentage}%`;
    }

    // Special Effects
    createFloatingHearts() {
        setInterval(() => {
            if (Math.random() < 0.3) {
                const heart = document.createElement('div');
                heart.innerHTML = '💕';
                heart.style.cssText = `
                    position: fixed;
                    top: 100vh;
                    left: ${Math.random() * 100}vw;
                    font-size: ${Math.random() * 20 + 15}px;
                    color: #ff6b9d;
                    pointer-events: none;
                    z-index: 1000;
                    animation: floatUp ${Math.random() * 3 + 4}s linear forwards;
                `;
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 7000);
            }
        }, 2000);
    }

    createSparkles(element) {
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            element.style.position = 'relative';
            element.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 1000);
        }
    }

    createFireworks() {
        const colors = ['#ff6b9d', '#ff8fab', '#ffd700', '#ff9a9e', '#fecfef'];
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.cssText = `
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 100}vh;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    animation-delay: ${Math.random() * 2}s;
                `;
                document.getElementById('fireworks').appendChild(firework);
                
                setTimeout(() => {
                    firework.remove();
                }, 1000);
            }, i * 200);
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.loveGame = new LoveGame();
});

// Add CSS animations for floating hearts
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);