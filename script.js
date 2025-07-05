// Super Mario Portfolio JavaScript

// Game state
let score = 999999;
let coins = 99;
let lives = 3;

// Sound effects (using Web Audio API for retro sounds)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create retro game sounds
function playSound(frequency, duration, type = 'square') {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Mario coin sound
function playCoinSound() {
    playSound(523.25, 0.1); // C5
    setTimeout(() => playSound(659.25, 0.1), 100); // E5
}

// Power-up sound
function playPowerUpSound() {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4 to G5
    notes.forEach((note, index) => {
        setTimeout(() => playSound(note, 0.15), index * 50);
    });
}

// Jump sound
function playJumpSound() {
    playSound(220, 0.2, 'square');
    setTimeout(() => playSound(440, 0.1, 'square'), 100);
}

// DOM Elements
const pipes = document.querySelectorAll('.pipe');
const questionBlocks = document.querySelectorAll('.question-block');
// const powerUps = document.querySelectorAll('.power-up'); // Replaced with social buttons
const marioSprite = document.querySelector('.mario-sprite');
const coins_elements = document.querySelectorAll('.coin');
const projectCards = document.querySelectorAll('.project-card');
const skillBlocks = document.querySelectorAll('.skill-block');

// Smooth scrolling for navigation pipes
pipes.forEach(pipe => {
    pipe.addEventListener('click', (e) => {
        playJumpSound();
        const targetSection = e.currentTarget.dataset.section;
        const target = document.getElementById(targetSection);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Add jump animation to pipe
        pipe.style.transform = 'scale(1.2) translateY(-10px)';
        setTimeout(() => {
            pipe.style.transform = '';
        }, 300);
    });
});

// Question block interactions
questionBlocks.forEach(block => {
    let clicked = false;
    
    block.addEventListener('click', () => {
        if (!clicked) {
            playCoinSound();
            clicked = true;
            
            // Animate question block
            block.style.transform = 'translateY(-10px)';
            block.textContent = '!';
            block.style.background = '#FFA500';
            
            // Create floating coin
            createFloatingCoin(block);
            
            // Update score
            score += 100;
            updateScoreDisplay();
            
            setTimeout(() => {
                block.style.transform = '';
                block.style.background = '#FFD700';
                block.textContent = '?';
                clicked = false;
            }, 500);
        }
    });
});

// Social button interactions
const socialButtons = document.querySelectorAll('.social-btn');
socialButtons.forEach(socialBtn => {
    socialBtn.addEventListener('click', (e) => {
        // Handle resume download separately
        if (socialBtn.classList.contains('resume')) {
            e.preventDefault();
            downloadResume();
            return;
        }
        
        // Add click effect
        socialBtn.style.transform = 'scale(1.2)';
        socialBtn.style.filter = 'brightness(1.3)';
        
        // Add coins for social interaction
        let coinBonus = 25;
        let message = '';
        
        if (socialBtn.classList.contains('linkedin')) {
            message = 'LINKEDIN CONNECTION! +25 coins';
        } else if (socialBtn.classList.contains('github')) {
            message = 'GITHUB REPOSITORY! +25 coins';
        } else if (socialBtn.classList.contains('email')) {
            message = 'EMAIL CONTACT! +25 coins';
            // Don't prevent default for email to allow mailto to work
        }
        
        coins += coinBonus;
        score += coinBonus * 10;
        updateScoreDisplay();
        
        if (message) {
            showPowerUpMessage(message);
        }
        
        setTimeout(() => {
            socialBtn.style.transform = '';
            socialBtn.style.filter = '';
        }, 1000);
    });
});

// Floating coins animation (sound disabled)
coins_elements.forEach((coin, index) => {
    coin.addEventListener('click', () => {
        // Disabled coin sound to reduce audio
        // playCoinSound();
        
        // Collect coin animation
        coin.style.transform = 'scale(1.5) rotate(360deg)';
        coin.style.opacity = '0';
        
        coins += 1;
        score += 50;
        updateScoreDisplay();
        
        setTimeout(() => {
            coin.style.transform = '';
            coin.style.opacity = '1';
        }, 1000);
    });
    
    // Random floating animation
    setInterval(() => {
        coin.style.transform = `translateY(${Math.sin(Date.now() * 0.001 + index) * 10}px)`;
    }, 50);
});

// Mario sprite interactions (sound disabled)
if (marioSprite) {
    marioSprite.addEventListener('click', () => {
        // Disabled jump sound to reduce audio
        // playJumpSound();
        marioSprite.style.animation = 'none';
        marioSprite.style.transform = 'translateY(-50px) rotate(360deg)';
        
        setTimeout(() => {
            marioSprite.style.animation = 'bounce 2s infinite';
            marioSprite.style.transform = '';
        }, 500);
    });
}

// Project card hover effects (sound disabled for less noise)
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Removed hover sound to reduce audio clutter
        // playSound(440, 0.1, 'sine');
    });
});

// Skill block progressive reveal
function revealSkillsOnScroll() {
    const skillsSection = document.getElementById('skills');
    const skillsRect = skillsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (skillsRect.top < windowHeight * 0.8) {
        skillBlocks.forEach((block, index) => {
            setTimeout(() => {
                block.classList.add('animate-slide-in-left');
                // Disabled skill sounds to reduce audio
                // if (index < 3) {
                //     playSound(523.25 + (index * 50), 0.1);
                // }
            }, index * 200);
        });
    }
}

// Create floating coin effect
function createFloatingCoin(element) {
    const coin = document.createElement('div');
    coin.className = 'floating-coin-effect';
    coin.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: #FFD700;
        border-radius: 50%;
        border: 2px solid #FFA500;
        z-index: 1000;
        pointer-events: none;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFA500;
        font-weight: bold;
    `;
    coin.textContent = '$';
    
    const rect = element.getBoundingClientRect();
    coin.style.left = rect.left + rect.width / 2 + 'px';
    coin.style.top = rect.top + window.scrollY + 'px';
    
    document.body.appendChild(coin);
    
    // Animate coin
    let y = 0;
    const animation = setInterval(() => {
        y -= 3;
        coin.style.transform = `translateY(${y}px) rotate(${y * 5}deg)`;
        coin.style.opacity = 1 + y / 100;
        
        if (y < -100) {
            clearInterval(animation);
            document.body.removeChild(coin);
        }
    }, 16);
}

// Show power-up message
function showPowerUpMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: #FFD700;
        padding: 20px 40px;
        border-radius: 10px;
        border: 3px solid #FFD700;
        font-family: 'Press Start 2P', cursive;
        font-size: 14px;
        z-index: 10000;
        animation: fadeInOut 2s ease-in-out forwards;
    `;
    messageDiv.textContent = message;
    
    // Add animation keyframes
    if (!document.querySelector('#powerup-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'powerup-animation-styles';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (document.body.contains(messageDiv)) {
            document.body.removeChild(messageDiv);
        }
    }, 2000);
}

// Resume download function
function downloadResume() {
    // Add visual effect
    const resumeBtn = document.querySelector('.social-btn.resume');
    resumeBtn.style.transform = 'scale(1.2)';
    resumeBtn.style.filter = 'brightness(1.3)';
    
    // Add coins for resume download
    coins += 50;
    score += 500;
    updateScoreDisplay();
    
    // Show message
    showPowerUpMessage('RESUME DOWNLOADED! +50 coins');
    
    // Download the actual PDF resume
    downloadPDFResume();
    
    setTimeout(() => {
        resumeBtn.style.transform = '';
        resumeBtn.style.filter = '';
    }, 1000);
}

// Download the actual PDF resume file
function downloadPDFResume() {
    const link = document.createElement('a');
    link.href = 'Irfan_Khan_resume.pdf';
    link.download = 'Irfan_Khan_resume.pdf';
    link.target = '_blank'; // Opens in new tab as fallback
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Update score display
function updateScoreDisplay() {
    const scoreElement = document.querySelector('.score');
    const coinsElement = document.querySelector('.coins');
    
    if (scoreElement) {
        scoreElement.textContent = `SCORE: ${score.toLocaleString()}`;
    }
    
    if (coinsElement) {
        coinsElement.textContent = `COINS: ${coins}`;
    }
}

// Scroll-based animations
function handleScroll() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Parallax effect for hero background
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrollTop * 0.5}px)`;
    }
    
    // Animate elements on scroll
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
    
    // Skills reveal
    revealSkillsOnScroll();
}

// Initialize scroll animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
}

// Form submission with Mario theme
const form = document.querySelector('.mario-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        playPowerUpSound();
        showPowerUpMessage('MESSAGE SENT! Thanks for contacting me!');
        
        // Reset form
        setTimeout(() => {
            form.reset();
        }, 2000);
    });
}

// Konami Code Easter Egg
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        
        // Easter egg activated!
        activateKonamiEasterEgg();
        konamiCode = [];
    }
});

function activateKonamiEasterEgg() {
    playPowerUpSound();
    
    // Add 1UP effect
    coins += 100;
    lives += 1;
    score += 10000;
    updateScoreDisplay();
    
    // Update lives display
    const livesElement = document.querySelector('.lives');
    if (livesElement) {
        livesElement.textContent = `LIVES: ${lives}`;
    }
    
    showPowerUpMessage('KONAMI CODE! +1UP +100 COINS +10000 POINTS!');
    
    // Add special visual effect
    document.body.style.animation = 'rainbow 3s ease-in-out';
    
    // Add rainbow animation if not exists
    if (!document.querySelector('#rainbow-animation')) {
        const style = document.createElement('style');
        style.id = 'rainbow-animation';
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 3000);
}

// Auto-play background music simulation with visual feedback
function createMusicVisualization() {
    const musicNotes = ['♪', '♫', '♬', '♩'];
    
    // Reduced frequency of musical notes (every 10 seconds instead of 3)
    setInterval(() => {
        const note = document.createElement('div');
        note.style.cssText = `
            position: fixed;
            top: ${Math.random() * 100}vh;
            left: ${Math.random() * 100}vw;
            font-size: 20px;
            color: rgba(255, 215, 0, 0.3);
            pointer-events: none;
            z-index: -1;
            animation: musicFloat 4s ease-in-out forwards;
        `;
        note.textContent = musicNotes[Math.floor(Math.random() * musicNotes.length)];
        
        // Add music float animation
        if (!document.querySelector('#music-animation')) {
            const style = document.createElement('style');
            style.id = 'music-animation';
            style.textContent = `
                @keyframes musicFloat {
                    0% { opacity: 0; transform: translateY(0) rotate(0deg); }
                    50% { opacity: 1; }
                    100% { opacity: 0; transform: translateY(-200px) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(note);
        
        setTimeout(() => {
            if (document.body.contains(note)) {
                document.body.removeChild(note);
            }
        }, 4000);
    }, 10000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    createMusicVisualization();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial call to handle elements already in view
    handleScroll();
    
    // Welcome message (disabled to reduce audio on load)
    // setTimeout(() => {
    //     showPowerUpMessage('WELCOME TO MARIO\'S PORTFOLIO!');
    // }, 1000);
});

// Resize handler for responsive animations
window.addEventListener('resize', () => {
    // Recalculate positions and animations on resize
    handleScroll();
});

// Performance optimization: throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll handler
window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', throttle(handleScroll, 16));
