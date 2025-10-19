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

        // Add helpful battle tips
        this.addBattleTips();
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

    // Level 1: AI Chat System
    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'bobo');
            input.value = '';
            this.gameState.chatMessages++;
            this.addLovePoints(5);
            
            // AI-powered Coco response
            setTimeout(() => {
                this.generateCocoResponse(message);
            }, 1000);
        }
    }

    generateCocoResponse(boboMessage) {
        const message = boboMessage.toLowerCase();
        let response = "";
        
        // Flight booking help
        if (message.includes('flight') || message.includes('book') || message.includes('ticket') || message.includes('dubai')) {
            const flightReplies = [
                "Oh Bobo! I'm so excited you're coming! ✈️ Let me help you choose the best flight!",
                "For the most romantic journey, I'd suggest the Business Class - we can upgrade to First Class together! 💕",
                "The Economy Class is fine too, my love! What matters is that you're coming to me! 😘",
                "I've been checking flights too! The evening flights have the most beautiful sunset views! 🌅",
                "Don't worry about the cost, my princess! I'll take care of everything when you're here! 💖"
            ];
            response = flightReplies[Math.floor(Math.random() * flightReplies.length)];
        }
        // Cute jokes and humor
        else if (message.includes('joke') || message.includes('funny') || message.includes('laugh')) {
            const jokes = [
                "Why did the airplane break up with the helicopter? Because it was too clingy! 😂✈️",
                "What do you call a fish that wears a bowtie? So-fish-ticated! 🐠💕",
                "Why don't scientists trust atoms? Because they make up everything! 😄⚛️",
                "What's the best thing about Switzerland? I don't know, but the flag is a big plus! 🇨🇭😆",
                "Why did Bobo go to the bank? To check her balance! (You're perfectly balanced in my heart!) 💕😘"
            ];
            response = jokes[Math.floor(Math.random() * jokes.length)];
        }
        // Love and relationship
        else if (message.includes('love') || message.includes('miss') || message.includes('heart')) {
            const loveReplies = [
                "I love you more than all the stars in Dubai's sky! ✨💕",
                "My heart skips a beat every time I see your message! 💓",
                "You're the sunshine in my cloudy Dubai days! ☀️💖",
                "I miss you so much, it feels like my heart is in Delhi! 💔✈️",
                "Every day without you feels like a year, my beautiful Bobo! 😘💕"
            ];
            response = loveReplies[Math.floor(Math.random() * loveReplies.length)];
        }
        // Birthday related
        else if (message.includes('birthday') || message.includes('bday') || message.includes('cake')) {
            const birthdayReplies = [
                "Happy Birthday, my beautiful Bobo! 🎂💕 I have the most amazing surprise planned for you!",
                "You're not getting older, you're getting more beautiful! Happy Birthday, my love! 🎉💖",
                "I wish I could be there to blow out your candles with you! Make a wish, my princess! ✨🎂",
                "Your birthday is the most important day of the year for me! I love you! 💕🎁",
                "Another year of being the most amazing girlfriend ever! Happy Birthday! 🥳💖"
            ];
            response = birthdayReplies[Math.floor(Math.random() * birthdayReplies.length)];
        }
        // General cute responses
        else {
            const generalReplies = [
                "You always know how to make me smile! 😊💕",
                "I'm so lucky to have you in my life, Bobo! 💖",
                "Your messages are the highlight of my day! ✨",
                "I can't wait to hold you in my arms again! 🤗💕",
                "You're the most beautiful girl in the world! 💕😘",
                "Every moment with you is magical! ✨💖",
                "I'm counting down the days until I see you! ⏰💕",
                "You make my heart race faster than a Ferrari! 🏎️💓"
            ];
            response = generalReplies[Math.floor(Math.random() * generalReplies.length)];
        }
        
        this.addMessage(response, 'coco');
        
        // Special flight booking encouragement
        if (this.gameState.chatMessages >= 3 && !this.gameState.flightBooked) {
            setTimeout(() => {
                this.addMessage("I miss you so much! When are you coming to Dubai? I'll be waiting at the airport with roses! 🌹✈️", 'coco');
            }, 2000);
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
            this.addMessage("That's amazing! I'll be waiting for you at the airport with roses! 🌹🥰", 'coco');
            this.addMessage("I've prepared the most romantic surprise for your birthday! 🎂💕", 'coco');
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
            clueBox.innerHTML = '<p><strong>🎉 Correct! You found Coco\'s tower! 💕</strong></p><p><em>Love has guided you to the right place!</em></p>';
            clueBox.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            clueBox.style.color = 'white';
            
            setTimeout(() => {
                this.nextLevel();
            }, 2000);
        } else {
            this.addLovePoints(-5);
            castle.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
            castle.style.color = 'white';
            
            // Show helpful hint
            const clueBox = document.querySelector('.clue-box');
            const currentHint = clueBox.innerHTML;
            clueBox.innerHTML = currentHint + '<p><em>💡 Try another tower! Remember: "where our love story began" 💕</em></p>';
            
            setTimeout(() => {
                castle.style.background = 'white';
                castle.style.color = 'black';
                clueBox.innerHTML = currentHint;
            }, 2000);
        }
    }

    // Level 3: Battle System
    attack() {
        const damage = Math.floor(Math.random() * 20) + 10;
        this.battleStats.enemyHealth = Math.max(0, this.battleStats.enemyHealth - damage);
        this.updateBattleUI();
        
        const attackMessages = [
            `Bobo strikes with determination! Deals ${damage} damage! ⚔️`,
            `Bobo's love-fueled attack hits for ${damage} damage! 💕`,
            `With courage in her heart, Bobo deals ${damage} damage! ✨`,
            `Bobo's fierce attack lands for ${damage} damage! 💪`
        ];
        this.addBattleLog(attackMessages[Math.floor(Math.random() * attackMessages.length)]);
        
        // Create attack effect
        this.createSparkles(document.querySelector('.bobo-sprite'));
        
        // Enemy counter-attack
        setTimeout(() => {
            if (this.battleStats.enemyHealth > 0) {
                const enemyDamage = Math.floor(Math.random() * 15) + 5;
                this.battleStats.playerHealth = Math.max(0, this.battleStats.playerHealth - enemyDamage);
                this.updateBattleUI();
                
                const enemyMessages = [
                    `Shadow Guardian strikes back! Bobo takes ${enemyDamage} damage! 👹`,
                    `The dark force attacks! Bobo loses ${enemyDamage} HP! ⚡`,
                    `Shadow Guardian's counter-attack deals ${enemyDamage} damage! 🌑`
                ];
                this.addBattleLog(enemyMessages[Math.floor(Math.random() * enemyMessages.length)]);
            }
        }, 1000);
        
        this.checkBattleEnd();
    }

    heal() {
        if (this.battleStats.playerHealth < 100) {
            const healAmount = Math.floor(Math.random() * 20) + 10;
            this.battleStats.playerHealth = Math.min(100, this.battleStats.playerHealth + healAmount);
            this.updateBattleUI();
            this.addLovePoints(5);
            
            const healMessages = [
                `Bobo channels her love energy and heals for ${healAmount} HP! 💖`,
                `The power of love restores ${healAmount} health to Bobo! ✨`,
                `Bobo's heart heals her for ${healAmount} HP! 💕`,
                `Love's healing light restores ${healAmount} health! 🌟`
            ];
            this.addBattleLog(healMessages[Math.floor(Math.random() * healMessages.length)]);
            
            // Create heal effect
            this.createSparkles(document.querySelector('.bobo-sprite'));
        } else {
            this.addBattleLog("Bobo is already at full health! 💕");
        }
    }

    specialAttack() {
        const damage = Math.floor(Math.random() * 30) + 20;
        this.battleStats.enemyHealth = Math.max(0, this.battleStats.enemyHealth - damage);
        this.updateBattleUI();
        this.addLovePoints(10);
        
        const specialMessages = [
            `Bobo unleashes the POWER OF LOVE! Deals ${damage} massive damage! 💕✨`,
            `Bobo channels pure love energy for ${damage} devastating damage! 💖⚡`,
            `The ultimate love attack strikes for ${damage} damage! 💕💥`,
            `Bobo's love power overwhelms the enemy for ${damage} damage! ✨💕`
        ];
        this.addBattleLog(specialMessages[Math.floor(Math.random() * specialMessages.length)]);
        
        // Create special effect
        this.createSparkles(document.querySelector('.bobo-sprite'));
        this.createSparkles(document.querySelector('.enemy-sprite'));
        
        // Enemy counter-attack
        setTimeout(() => {
            if (this.battleStats.enemyHealth > 0) {
                const enemyDamage = Math.floor(Math.random() * 10) + 5;
                this.battleStats.playerHealth = Math.max(0, this.battleStats.playerHealth - enemyDamage);
                this.updateBattleUI();
                
                this.addBattleLog(`Shadow Guardian's weakened counter-attack deals ${enemyDamage} damage! 👹`);
            }
        }, 1000);
        
        this.checkBattleEnd();
    }

    updateBattleUI() {
        const playerHealthBar = document.getElementById('player-health');
        const enemyHealthBar = document.getElementById('enemy-health');
        const playerHpText = document.getElementById('player-hp-text');
        const enemyHpText = document.getElementById('enemy-hp-text');
        
        playerHealthBar.style.width = `${this.battleStats.playerHealth}%`;
        enemyHealthBar.style.width = `${this.battleStats.enemyHealth}%`;
        playerHpText.textContent = this.battleStats.playerHealth;
        enemyHpText.textContent = this.battleStats.enemyHealth;
    }

    addBattleLog(message) {
        const battleLog = document.getElementById('battle-log');
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = message;
        battleLog.appendChild(logEntry);
        battleLog.scrollTop = battleLog.scrollHeight;
    }

    checkBattleEnd() {
        if (this.battleStats.enemyHealth <= 0) {
            this.gameState.enemiesDefeated++;
            this.addLovePoints(50);
            
            this.addBattleLog("🎉 VICTORY! Bobo has defeated the Shadow Guardian! 💕");
            this.addBattleLog("The path to Coco is now clear! Love has triumphed! ✨");
            
            // Show victory effects
            const enemySprite = document.querySelector('.enemy-sprite');
            enemySprite.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            enemySprite.style.animation = 'battleFloat 0.5s ease-in-out infinite';
            
            // Create victory sparkles
            this.createSparkles(document.querySelector('.bobo-sprite'));
            this.createSparkles(document.querySelector('.enemy-sprite'));
            
            setTimeout(() => {
                this.nextLevel();
            }, 3000);
        } else if (this.battleStats.playerHealth <= 0) {
            // Game over - restart battle
            this.addBattleLog("💔 Bobo's health is depleted! But love never gives up! 💕");
            this.addBattleLog("Bobo finds the strength to continue fighting for love! ✨");
            
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
            "Happy Birthday, beautiful Bobo! 🎂💕",
            "May our love shine brighter than Diwali fireworks! ✨",
            "You are my everything, Bobo! 💕",
            "Here's to many more birthdays together! 🥂",
            "I love you more than words can express! 💖",
            "You're the most amazing girlfriend ever! 💕",
            "Every day with you is a celebration! 🎉",
            "Your smile lights up my world! ✨",
            "I'm so lucky to have you in my life! 💖",
            "Here's to another year of our beautiful love story! 💕"
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

    // Helper Functions
    addBattleTips() {
        setTimeout(() => {
            this.addBattleLog("💡 Tip: Use Attack for steady damage, Heal when low on health, Love Power for big hits! 💕");
        }, 2000);
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