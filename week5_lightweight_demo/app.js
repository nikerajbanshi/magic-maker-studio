/**
 * SoundSteps Flashcard App
 * Lightweight JavaScript - No external libraries
 * Handles flashcard navigation and audio playback
 */

(function() {
    'use strict';

    // Flashcard data for A and B
    const flashcards = [
        {
            letter: 'A',
            letterLower: 'a',
            word: 'Apple',
            image: 'assets/apple.webp',
            imageAlt: 'Apple - starts with A',
            audio: 'audioA'
        },
        {
            letter: 'B',
            letterLower: 'b',
            word: 'Ball',
            image: 'assets/ball.webp',
            imageAlt: 'Ball - starts with B',
            audio: 'audioB'
        }
    ];

    // Total cards (for display purposes, showing as 26 even with 2 cards demo)
    const TOTAL_DISPLAY_CARDS = 26;

    // State
    let currentCardIndex = 0;

    // DOM Elements
    const letterUpper = document.getElementById('letterUpper');
    const letterLower = document.getElementById('letterLower');
    const cardImage = document.getElementById('cardImage');
    const cardIndex = document.getElementById('cardIndex');
    const progressDot = document.getElementById('progressDot');
    const playSoundBtn = document.getElementById('playSoundBtn');
    const prevCardBtn = document.getElementById('prevCardBtn');
    const nextCardBtn = document.getElementById('nextCardBtn');
    const card = document.querySelector('.card');

    /**
     * Update progress bar position
     */
    function updateProgress() {
        // Calculate position as percentage (using actual flashcards length)
        const percentage = (currentCardIndex / (flashcards.length - 1)) * 100;
        progressDot.style.left = `calc(${percentage}% - 7px)`;
    }

    /**
     * Update the flashcard display with current card data
     */
    function updateCard() {
        const currentCard = flashcards[currentCardIndex];
        
        // Add animation class
        card.classList.remove('animate');
        // Force reflow to restart animation
        void card.offsetWidth;
        card.classList.add('animate');

        // Update content
        letterUpper.textContent = currentCard.letter;
        letterLower.textContent = currentCard.letterLower;
        cardImage.src = currentCard.image;
        cardImage.alt = currentCard.imageAlt;
        
        // Update progress text (show as X / 26 for demo purposes)
        cardIndex.textContent = `${currentCardIndex + 1} / ${TOTAL_DISPLAY_CARDS}`;
        
        // Update progress bar
        updateProgress();
    }

    /**
     * Play the sound for the current letter
     */
    function playSound() {
        const currentCard = flashcards[currentCardIndex];
        const audioElement = document.getElementById(currentCard.audio);
        
        if (audioElement) {
            // Reset audio to beginning - allows repeated plays
            audioElement.currentTime = 0;
            audioElement.play().catch(function(error) {
                console.log('Audio playback failed:', error.message);
            });
        }
    }

    /**
     * Navigate to the next flashcard
     */
    function nextCard() {
        currentCardIndex = (currentCardIndex + 1) % flashcards.length;
        updateCard();
    }

    /**
     * Navigate to the previous flashcard
     */
    function prevCard() {
        currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
        updateCard();
    }

    /**
     * Initialize the application
     */
    function init() {
        // Set up event listeners
        playSoundBtn.addEventListener('click', playSound);
        nextCardBtn.addEventListener('click', nextCard);
        prevCardBtn.addEventListener('click', prevCard);

        // Keyboard navigation for accessibility
        document.addEventListener('keydown', function(event) {
            switch(event.key) {
                case 'ArrowRight':
                    event.preventDefault();
                    nextCard();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    prevCard();
                    break;
                case ' ':
                case 'Enter':
                case 'p':
                case 'P':
                    event.preventDefault();
                    playSound();
                    break;
            }
        });

        // Initial card display
        updateCard();

        console.log('SoundSteps Flashcard App initialized successfully!');
    }

    // Start the app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
