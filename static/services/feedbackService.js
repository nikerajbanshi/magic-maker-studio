/**
 * Feedback Service
 * Handles visual feedback, confetti, toasts, and sound effects
 */

(function(window) {
    'use strict';

    class FeedbackService {
        constructor() {
            this.sounds = {};
            this.confettiCanvas = null;
            this.confettiCtx = null;
            this.confettiParticles = [];
            this.isAnimating = false;
            
            this.init();
        }

        /**
         * Initialize feedback service
         */
        init() {
            // Setup confetti canvas
            this.setupConfettiCanvas();
            
            // Preload sounds (optional - will create on demand)
            this.preloadSounds();
        }

        /**
         * Setup confetti canvas
         */
        setupConfettiCanvas() {
            this.confettiCanvas = document.getElementById('confettiCanvas');
            if (this.confettiCanvas) {
                this.confettiCtx = this.confettiCanvas.getContext('2d');
                this.resizeCanvas();
                window.addEventListener('resize', () => this.resizeCanvas());
            }
        }

        /**
         * Resize confetti canvas
         */
        resizeCanvas() {
            if (this.confettiCanvas) {
                this.confettiCanvas.width = window.innerWidth;
                this.confettiCanvas.height = window.innerHeight;
            }
        }

        /**
         * Preload sound effects
         */
        preloadSounds() {
            // Create audio context on first user interaction to comply with browser policies
            document.addEventListener('click', () => {
                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
            }, { once: true });
        }

        /**
         * Play a success sound using Web Audio API
         */
        playSuccessSound() {
            this.playTone([523.25, 659.25, 783.99], 0.15, 'triangle'); // C-E-G chord
        }

        /**
         * Play an error sound
         */
        playErrorSound() {
            this.playTone([200], 0.2, 'sawtooth');
        }

        /**
         * Play achievement fanfare
         */
        playAchievementSound() {
            this.playTone([392, 523.25, 659.25, 783.99], 0.2, 'sine'); // G-C-E-G ascending
        }

        /**
         * Play a tone sequence
         */
        playTone(frequencies, duration, type = 'sine') {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            const ctx = this.audioContext;
            const now = ctx.currentTime;

            frequencies.forEach((freq, i) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.type = type;
                oscillator.frequency.setValueAtTime(freq, now + i * duration);

                gainNode.gain.setValueAtTime(0.3, now + i * duration);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * duration);

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.start(now + i * duration);
                oscillator.stop(now + (i + 1) * duration);
            });
        }

        /**
         * Show confetti celebration
         */
        showConfetti(options = {}) {
            const defaults = {
                particleCount: 150,
                spread: 70,
                origin: { x: 0.5, y: 0.6 },
                colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFD700'],
                duration: 3000
            };

            const config = { ...defaults, ...options };
            
            if (!this.confettiCanvas) return;

            // Create particles
            for (let i = 0; i < config.particleCount; i++) {
                this.confettiParticles.push({
                    x: this.confettiCanvas.width * config.origin.x,
                    y: this.confettiCanvas.height * config.origin.y,
                    vx: (Math.random() - 0.5) * config.spread * 0.5,
                    vy: -Math.random() * 15 - 10,
                    color: config.colors[Math.floor(Math.random() * config.colors.length)],
                    size: Math.random() * 10 + 5,
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 10,
                    gravity: 0.3,
                    decay: 0.95
                });
            }

            if (!this.isAnimating) {
                this.isAnimating = true;
                this.animateConfetti();
            }

            // Clear after duration
            setTimeout(() => {
                this.confettiParticles = [];
            }, config.duration);
        }

        /**
         * Animate confetti particles
         */
        animateConfetti() {
            if (!this.confettiCtx) {
                this.isAnimating = false;
                return;
            }
            
            // Stop animation if no particles
            if (this.confettiParticles.length === 0) {
                this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
                this.isAnimating = false;
                return;
            }

            this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

            // Filter out off-screen particles first (don't splice during iteration)
            this.confettiParticles = this.confettiParticles.filter(p => p.y <= this.confettiCanvas.height + 50);

            this.confettiParticles.forEach((p) => {
                // Update physics
                p.vy += p.gravity;
                p.vx *= p.decay;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;

                // Draw particle
                this.confettiCtx.save();
                this.confettiCtx.translate(p.x, p.y);
                this.confettiCtx.rotate(p.rotation * Math.PI / 180);
                this.confettiCtx.fillStyle = p.color;
                this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                this.confettiCtx.restore();
            });

            requestAnimationFrame(() => this.animateConfetti());
        }

        /**
         * Show toast notification
         */
        showToast(message, type = 'info', duration = 3000) {
            // Remove existing toast
            const existingToast = document.querySelector('.toast');
            if (existingToast) {
                existingToast.remove();
            }

            // Create toast element
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <div class="toast-content">
                    <span class="toast-icon">${this.getToastIcon(type)}</span>
                    <span class="toast-message">${message}</span>
                </div>
            `;

            document.body.appendChild(toast);

            // Remove after duration
            setTimeout(() => {
                toast.style.animation = 'toastSlideOut 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        /**
         * Get toast icon based on type
         */
        getToastIcon(type) {
            const icons = {
                success: '✅',
                error: '❌',
                info: 'ℹ️',
                achievement: '🏆',
                streak: '🔥'
            };
            return icons[type] || icons.info;
        }

        /**
         * Celebrate correct answer
         */
        celebrateCorrect(message = '🎉 Great job!') {
            this.playSuccessSound();
            this.showConfetti({ particleCount: 50 });
            this.showToast(message, 'success');
        }

        /**
         * Show wrong answer feedback
         */
        showWrong(message = '❌ Try again!') {
            this.playErrorSound();
            this.showToast(message, 'error');
        }

        /**
         * Show achievement unlock
         */
        showAchievementUnlock(title, message) {
            this.playAchievementSound();
            this.showConfetti({ particleCount: 200, duration: 5000 });
            
            // Create achievement modal
            const modal = document.createElement('div');
            modal.className = 'achievement-modal';
            modal.innerHTML = `
                <div class="achievement-content">
                    <div class="achievement-badge">🏆</div>
                    <h2 class="achievement-title">${title}</h2>
                    <p class="achievement-message">${message}</p>
                    <button class="btn btn-primary achievement-close">Awesome!</button>
                </div>
            `;

            document.body.appendChild(modal);

            // Close on button click
            modal.querySelector('.achievement-close').addEventListener('click', () => {
                modal.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => modal.remove(), 300);
            });

            // Auto close after 5 seconds
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    modal.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => modal.remove(), 300);
                }
            }, 5000);
        }

        /**
         * Monster eating animation
         */
        monsterEat() {
            const monster = document.getElementById('monsterAvatar');
            if (monster) {
                monster.classList.add('eating');
                setTimeout(() => monster.classList.remove('eating'), 500);
            }
        }

        /**
         * Monster shake (wrong answer)
         */
        monsterShake() {
            const monster = document.getElementById('monsterAvatar');
            if (monster) {
                monster.classList.add('shake');
                setTimeout(() => monster.classList.remove('shake'), 500);
            }
        }
    }

    // Export FeedbackService
    window.FeedbackService = FeedbackService;

    // Initialize on load
    window.addEventListener('DOMContentLoaded', () => {
        window.feedbackService = new FeedbackService();
    });

})(window);
