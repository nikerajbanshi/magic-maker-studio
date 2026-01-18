/**
 * SoundSteps - Complete Application JavaScript
 * Handles all screens, API interactions, and game logic
 */

(function() {
    'use strict';

    // API Configuration
    const API_BASE = '/api';
    
    // Application State
    const state = {
        sessionId: null,
        userName: 'Guest',
        currentScreen: 'start',
        flashcards: [],
        currentCardIndex: 0,
        soundoutWords: [],
        currentWordIndex: 0,
        monsterQuestions: [],
        currentQuestionIndex: 0,
        gameScore: 0,
        minimalPairs: [],
        currentPairIndex: 0
    };

    // DOM Elements Cache
    const elements = {
        // Screens
        authScreen: document.getElementById('authScreen'),
        startScreen: document.getElementById('startScreen'),
        dashboardScreen: document.getElementById('dashboardScreen'),
        flashcardsScreen: document.getElementById('flashcardsScreen'),
        soundoutScreen: document.getElementById('soundoutScreen'),
        monsterScreen: document.getElementById('monsterScreen'),
        pairsScreen: document.getElementById('pairsScreen'),
        loadingIndicator: document.getElementById('loadingIndicator'),
        
        // Start Screen
        userName: document.getElementById('userName'),
        startBtn: document.getElementById('startBtn'),
        
        // Dashboard
        welcomeMessage: document.getElementById('welcomeMessage'),
        moduleCards: document.querySelectorAll('.module-card'),
        logoutBtn: document.getElementById('logoutBtn'),
        userBadge: document.getElementById('userBadge'),
        
        // Navigation
        homeBtn: document.getElementById('homeBtn'),
        backBtns: document.querySelectorAll('.back-btn'),
        
        // Flashcards
        flashcard: document.getElementById('flashcard'),
        letterUpper: document.getElementById('letterUpper'),
        letterLower: document.getElementById('letterLower'),
        cardImage: document.getElementById('cardImage'),
        wordLabel: document.getElementById('wordLabel'),
        playSoundBtn: document.getElementById('playSoundBtn'),
        cardIndex: document.getElementById('cardIndex'),
        progressDot: document.getElementById('progressDot'),
        prevCardBtn: document.getElementById('prevCardBtn'),
        nextCardBtn: document.getElementById('nextCardBtn'),
        
        // Sound It Out
        soundoutWord: document.getElementById('soundoutWord'),
        soundoutImage: document.getElementById('soundoutImage'),
        phonemeDisplay: document.getElementById('phonemeDisplay'),
        blendSlider: document.getElementById('blendSlider'),
        playBlendBtn: document.getElementById('playBlendBtn'),
        wordProgress: document.getElementById('wordProgress'),
        prevWordBtn: document.getElementById('prevWordBtn'),
        nextWordBtn: document.getElementById('nextWordBtn'),
        
        // Hungry Monster
        monsterQuestion: document.getElementById('monsterQuestion'),
        monsterOptions: document.getElementById('monsterOptions'),
        gameFeedback: document.getElementById('gameFeedback'),
        gameProgress: document.getElementById('gameProgress'),
        gameScore: document.getElementById('gameScore'),
        
        // Minimal Pairs
        pairsCategory: document.getElementById('pairsCategory'),
        wordsToSort: document.getElementById('wordsToSort'),
        bucketP: document.getElementById('bucket-p'),
        bucketB: document.getElementById('bucket-b'),
        pairsFeedback: document.getElementById('pairsFeedback'),
        checkPairsBtn: document.getElementById('checkPairsBtn')
    };

    // Utility Functions
    function showLoading() {
        elements.loadingIndicator.classList.remove('hidden');
    }

    function hideLoading() {
        elements.loadingIndicator.classList.add('hidden');
    }

    function showScreen(screenName) {
        // Hide all screens (both .screen and .auth-screen)
        document.querySelectorAll('.screen, .auth-screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Show requested screen
        const screenMap = {
            'auth': elements.authScreen,
            'start': elements.startScreen,
            'dashboard': elements.dashboardScreen,
            'flashcards': elements.flashcardsScreen,
            'soundout': elements.soundoutScreen,
            'monster': elements.monsterScreen,
            'pairs': elements.pairsScreen
        };
        
        if (screenMap[screenName]) {
            screenMap[screenName].classList.remove('hidden');
            state.currentScreen = screenName;
            
            // Update dashboard stats when showing dashboard
            if (screenName === 'dashboard') {
                updateDashboardStats();
            }
        }
    }

    async function apiCall(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`API call failed: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    }

    // Start Screen Functions
    async function startSession() {
        const name = elements.userName.value.trim() || 'Guest';
        showLoading();
        
        const result = await apiCall('/user/start', {
            method: 'POST',
            body: JSON.stringify({ name })
        });
        
        hideLoading();
        
        if (result && result.sessionId) {
            state.sessionId = result.sessionId;
            state.userName = name;
            elements.welcomeMessage.textContent = `Welcome, ${name}!`;
            showScreen('dashboard');
        } else {
            alert('Failed to start session. Please try again.');
        }
    }

    // Dashboard Functions
    function navigateToModule(moduleName) {
        switch(moduleName) {
            case 'flashcards':
                loadFlashcards();
                break;
            case 'soundout':
                loadSoundOut();
                break;
            case 'monster':
                loadMonsterGame();
                break;
            case 'pairs':
                loadMinimalPairs();
                break;
        }
    }

    // Update Dashboard Stats, Skills, and Leaderboard
    async function updateDashboardStats() {
        // Get progress data from progressTracker
        const progressData = window.progressTracker ? window.progressTracker.getProgress() : null;
        
        // Update user stats
        const totalPointsEl = document.getElementById('totalPoints');
        const currentStreakEl = document.getElementById('currentStreak');
        const userRankEl = document.getElementById('userRank');
        
        if (progressData) {
            const totalScore = progressData.overallProgress?.totalScore || 0;
            const currentStreak = progressData.overallProgress?.currentStreak || 0;
            
            if (totalPointsEl) {
                animateNumber(totalPointsEl, totalScore);
            }
            if (currentStreakEl) {
                currentStreakEl.textContent = currentStreak;
                // Add fire animation if streak > 0
                if (currentStreak > 0) {
                    currentStreakEl.parentElement.parentElement.classList.add('on-fire');
                }
            }
        }
        
        // Update leaderboard
        await updateLeaderboardPreview();
        
        // Update skills section
        updateSkillsBadges(progressData);
    }
    
    // Animate number counting up
    function animateNumber(element, target) {
        const current = parseInt(element.textContent) || 0;
        if (current === target) return;
        
        const step = Math.ceil((target - current) / 20);
        let value = current;
        
        const interval = setInterval(() => {
            value += step;
            if ((step > 0 && value >= target) || (step < 0 && value <= target)) {
                value = target;
                clearInterval(interval);
            }
            element.textContent = value;
        }, 30);
    }

    async function updateLeaderboardPreview() {
        const leaderboardContainer = document.getElementById('leaderboardPreview');
        if (!leaderboardContainer || !window.leaderboardService) return;
        
        try {
            const leaderboard = await window.leaderboardService.getTop(5);
            const currentUser = state.userName || localStorage.getItem('guestName') || 'Guest';
            
            if (leaderboard && leaderboard.length > 0) {
                leaderboardContainer.innerHTML = leaderboard.map((entry, index) => {
                    const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
                    const isCurrentUser = entry.name === currentUser;
                    return `
                        <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}">
                            <span class="leaderboard-rank ${rankClass}">${index + 1}</span>
                            <span class="leaderboard-name">${entry.name}</span>
                            <span class="leaderboard-score">${entry.score} pts</span>
                        </div>
                    `;
                }).join('');
                
                // Update user rank
                const userRankEl = document.getElementById('userRank');
                const userRank = leaderboard.findIndex(e => e.name === currentUser);
                if (userRankEl) {
                    userRankEl.textContent = userRank >= 0 ? `#${userRank + 1}` : '-';
                }
            } else {
                leaderboardContainer.innerHTML = '<p style="color: #666; text-align: center;">No scores yet. Start learning!</p>';
            }
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
            leaderboardContainer.innerHTML = '<p style="color: #666; text-align: center;">Leaderboard loading...</p>';
        }
    }

    function updateSkillsBadges(progressData) {
        const skillsGrid = document.getElementById('skillsGrid');
        if (!skillsGrid) return;
        
        // Define skill badges based on achievements
        const skills = [
            { id: 'alphabet-master', name: 'ABC Master', icon: '🔤', requirement: 'flashcards', threshold: 10 },
            { id: 'sound-explorer', name: 'Sound Pro', icon: '🔊', requirement: 'soundout', threshold: 5 },
            { id: 'monster-tamer', name: 'Monster Tamer', icon: '👾', requirement: 'monster', threshold: 3 },
            { id: 'pair-sorter', name: 'Pair Expert', icon: '🎯', requirement: 'pairs', threshold: 5 },
            { id: 'streak-star', name: 'Streak Star', icon: '🔥', requirement: 'streak', threshold: 3 },
            { id: 'points-pro', name: 'Points Pro', icon: '🏆', requirement: 'points', threshold: 100 }
        ];
        
        const modules = progressData?.modules || {};
        const overall = progressData?.overallProgress || {};
        
        // Track previously unlocked skills
        const previouslyUnlocked = JSON.parse(localStorage.getItem('unlockedSkills') || '[]');
        const currentlyUnlocked = [];
        
        skillsGrid.innerHTML = skills.map(skill => {
            let unlocked = false;
            let progress = 0;
            let maxProgress = skill.threshold;
            
            switch(skill.requirement) {
                case 'flashcards':
                    const lettersCount = modules.flashcards?.lettersCompleted?.length || 0;
                    progress = lettersCount;
                    unlocked = lettersCount >= skill.threshold;
                    break;
                case 'soundout':
                    const wordsCount = modules.soundItOut?.wordsCompleted || 0;
                    progress = wordsCount;
                    unlocked = wordsCount >= skill.threshold;
                    break;
                case 'monster':
                    const gamesCount = modules.hungryMonster?.gamesPlayed || 0;
                    progress = gamesCount;
                    unlocked = gamesCount >= skill.threshold;
                    break;
                case 'pairs':
                    const pairsCount = modules.minimalPairs?.correctSorts || 0;
                    progress = pairsCount;
                    unlocked = pairsCount >= skill.threshold;
                    break;
                case 'streak':
                    const streak = overall.currentStreak || 0;
                    progress = streak;
                    unlocked = streak >= skill.threshold;
                    break;
                case 'points':
                    const points = overall.totalScore || 0;
                    progress = points;
                    unlocked = points >= skill.threshold;
                    break;
            }
            
            if (unlocked) {
                currentlyUnlocked.push(skill.id);
                
                // Check if this is a NEW unlock
                if (!previouslyUnlocked.includes(skill.id)) {
                    // Show instant gratification!
                    setTimeout(() => {
                        showSkillUnlockCelebration(skill);
                    }, 500);
                }
            }
            
            const progressPercent = Math.min(100, Math.round((progress / maxProgress) * 100));
            
            return `
                <div class="skill-badge ${unlocked ? 'unlocked' : 'locked'}" data-skill="${skill.id}">
                    <span class="skill-icon">${skill.icon}</span>
                    <span class="skill-name">${skill.name}</span>
                    ${!unlocked ? `<div class="skill-progress"><div class="skill-progress-bar" style="width: ${progressPercent}%"></div></div>` : ''}
                </div>
            `;
        }).join('');
        
        // Save currently unlocked skills
        localStorage.setItem('unlockedSkills', JSON.stringify(currentlyUnlocked));
    }
    
    // Show celebration when a skill is unlocked
    function showSkillUnlockCelebration(skill) {
        // Show confetti
        if (window.feedbackService) {
            window.feedbackService.showConfetti({ particleCount: 150 });
            window.feedbackService.playSuccessSound();
        }
        
        // Create skill unlock modal
        const modal = document.createElement('div');
        modal.className = 'skill-unlock-modal';
        modal.innerHTML = `
            <div class="skill-unlock-content">
                <div class="skill-unlock-icon">${skill.icon}</div>
                <h2 class="skill-unlock-title">Skill Unlocked!</h2>
                <p class="skill-unlock-name">${skill.name}</p>
                <button class="btn btn-primary skill-unlock-close">Awesome!</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add animation class after a brief delay
        setTimeout(() => modal.classList.add('show'), 50);
        
        // Close on button click
        modal.querySelector('.skill-unlock-close').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
        
        // Auto close after 4 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            }
        }, 4000);
    }

    // Flashcards Functions
    async function loadFlashcards() {
        showLoading();
        const result = await apiCall('/cards');
        hideLoading();
        
        if (result && result.cards) {
            state.flashcards = result.cards;
            state.currentCardIndex = 0;
            showScreen('flashcards');
            updateFlashcard();
        }
    }

    function updateFlashcard() {
        if (state.flashcards.length === 0) return;
        
        const card = state.flashcards[state.currentCardIndex];
        
        // Animate card
        elements.flashcard.classList.remove('animate');
        void elements.flashcard.offsetWidth; // Force reflow
        elements.flashcard.classList.add('animate');
        
        // Update content
        elements.letterUpper.textContent = card.letter;
        elements.letterLower.textContent = card.letterLower;
        elements.cardImage.src = card.image;
        elements.cardImage.alt = card.word;
        elements.wordLabel.textContent = card.word;
        
        // Update progress
        elements.cardIndex.textContent = `${state.currentCardIndex + 1} / ${state.flashcards.length}`;
        updateProgress();
    }

    function updateProgress() {
        const percentage = (state.currentCardIndex / (state.flashcards.length - 1)) * 100;
        elements.progressDot.style.left = `calc(${percentage}% - 7px)`;
    }

    function playCardSound() {
        const card = state.flashcards[state.currentCardIndex];
        if (card && card.audio) {
            const audio = new Audio(card.audio);
            audio.play().catch(err => console.log('Audio play failed:', err));
        }
    }

    function nextCard() {
        if (state.currentCardIndex < state.flashcards.length - 1) {
            state.currentCardIndex++;
            updateFlashcard();
        }
    }

    function prevCard() {
        if (state.currentCardIndex > 0) {
            state.currentCardIndex--;
            updateFlashcard();
        }
    }

    // Sound It Out Functions
    async function loadSoundOut() {
        showLoading();
        const result = await apiCall('/soundout');
        hideLoading();
        
        if (result && result.words) {
            state.soundoutWords = result.words;
            state.currentWordIndex = 0;
            showScreen('soundout');
            updateSoundOut();
        }
    }

    function updateSoundOut() {
        if (state.soundoutWords.length === 0) return;
        
        const word = state.soundoutWords[state.currentWordIndex];
        
        elements.soundoutWord.textContent = word.word;
        elements.soundoutImage.src = word.image;
        elements.soundoutImage.alt = word.word;
        
        // Update phonemes with clickable letter sounds
        elements.phonemeDisplay.innerHTML = '';
        word.phonemes.forEach((phoneme, index) => {
            const span = document.createElement('span');
            span.className = 'phoneme clickable';
            span.textContent = phoneme;
            span.title = `Click to hear the "${phoneme}" sound`;
            span.addEventListener('click', () => playLetterSound(phoneme, span));
            elements.phonemeDisplay.appendChild(span);
        });
        
        elements.wordProgress.textContent = `${state.currentWordIndex + 1} / ${state.soundoutWords.length}`;
        elements.blendSlider.value = 0;
    }
    
    // Play individual letter/phoneme sound
    function playLetterSound(letter, element) {
        // Visual feedback
        if (element) {
            element.classList.add('playing');
            setTimeout(() => element.classList.remove('playing'), 500);
        }
        
        const lowerLetter = letter.toLowerCase();
        
        // Phoneme pronunciations for TTS
        const phonemePronunciations = {
            'a': 'ah', 'b': 'buh', 'c': 'kuh', 'd': 'duh', 'e': 'eh',
            'f': 'fuh', 'g': 'guh', 'h': 'huh', 'i': 'ih', 'j': 'juh',
            'k': 'kuh', 'l': 'luh', 'm': 'muh', 'n': 'nuh', 'o': 'oh',
            'p': 'puh', 'q': 'kwuh', 'r': 'ruh', 's': 'suh', 't': 'tuh',
            'u': 'uh', 'v': 'vuh', 'w': 'wuh', 'x': 'ks', 'y': 'yuh', 'z': 'zuh'
        };
        
        // Try MP3 audio file first
        const audio = new Audio(`/assets/audio/${lowerLetter}-sound.mp3`);
        
        audio.play().catch(() => {
            // Fallback: Use Web Speech API with phoneme pronunciation
            const synth = window.speechSynthesis;
            if (synth) {
                const utterance = new SpeechSynthesisUtterance(phonemePronunciations[lowerLetter] || lowerLetter);
                utterance.rate = 0.8;
                utterance.pitch = 1.0;
                synth.speak(utterance);
            } else {
                // Last resort: Web Audio API generated sound
                generatePhonemeSound(lowerLetter);
            }
        });
    }
    
    // Generate phoneme sounds using Web Audio API
    function generatePhonemeSound(phoneme) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        // Different sound characteristics for different phonemes
        const phonemeConfigs = {
            // Vowels - sustained tones
            'a': { freq: [220, 280], type: 'sine', duration: 0.4 },
            'e': { freq: [330, 400], type: 'sine', duration: 0.4 },
            'i': { freq: [420, 480], type: 'sine', duration: 0.4 },
            'o': { freq: [260, 320], type: 'sine', duration: 0.4 },
            'u': { freq: [300, 360], type: 'sine', duration: 0.4 },
            // Consonants - short bursts
            'b': { freq: [100, 200], type: 'square', duration: 0.15 },
            'c': { freq: [2000, 3000], type: 'sawtooth', duration: 0.1 },
            'd': { freq: [150, 300], type: 'square', duration: 0.15 },
            'f': { freq: [2500, 4000], type: 'sawtooth', duration: 0.2 },
            'g': { freq: [120, 250], type: 'square', duration: 0.15 },
            'h': { freq: [800, 1200], type: 'sawtooth', duration: 0.2 },
            'j': { freq: [200, 400], type: 'square', duration: 0.15 },
            'k': { freq: [2500, 3500], type: 'sawtooth', duration: 0.1 },
            'l': { freq: [350, 450], type: 'sine', duration: 0.25 },
            'm': { freq: [200, 280], type: 'sine', duration: 0.3 },
            'n': { freq: [250, 350], type: 'sine', duration: 0.25 },
            'p': { freq: [150, 300], type: 'square', duration: 0.1 },
            'r': { freq: [280, 380], type: 'sine', duration: 0.25 },
            's': { freq: [4000, 6000], type: 'sawtooth', duration: 0.2 },
            't': { freq: [3000, 5000], type: 'sawtooth', duration: 0.1 },
            'v': { freq: [150, 2500], type: 'sawtooth', duration: 0.2 },
            'w': { freq: [300, 400], type: 'sine', duration: 0.25 },
            'x': { freq: [2500, 4500], type: 'sawtooth', duration: 0.15 },
            'y': { freq: [350, 450], type: 'sine', duration: 0.25 },
            'z': { freq: [200, 4000], type: 'sawtooth', duration: 0.2 }
        };
        
        const config = phonemeConfigs[phoneme.toLowerCase()] || { freq: [300, 400], type: 'sine', duration: 0.2 };
        
        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.freq[0], ctx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(config.freq[1], ctx.currentTime + config.duration * 0.5);
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + config.duration);
    }

    function playBlendSound() {
        const word = state.soundoutWords[state.currentWordIndex];
        const sliderValue = parseInt(elements.blendSlider.value);
        
        // Play segmented or blended based on slider position
        const audioSrc = sliderValue > 50 ? word.blendedAudio : word.segmentedAudio;
        const audio = new Audio(audioSrc);
        audio.play().catch(() => {
            // Fallback to TTS
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(word.word);
                utterance.rate = sliderValue > 50 ? 1.0 : 0.5;
                speechSynthesis.speak(utterance);
            }
        });
    }
    
    // Auto-play sound when slider changes position (with debounce)
    let sliderDebounce = null;
    function handleSliderChange() {
        clearTimeout(sliderDebounce);
        sliderDebounce = setTimeout(() => {
            playBlendSound();
        }, 300);
    }
    
    // Speech recognition for microphone practice
    let recognition = null;
    let isListening = false;
    
    function initSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.log('Speech recognition not supported');
            return null;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 3;
        
        recognition.onresult = (event) => {
            const results = event.results[0];
            const spokenWords = [];
            
            for (let i = 0; i < results.length; i++) {
                spokenWords.push(results[i].transcript.toLowerCase().trim());
            }
            
            handleSpeechResult(spokenWords);
        };
        
        recognition.onerror = (event) => {
            console.log('Speech recognition error:', event.error);
            stopListening();
            updateMicButton(false, 'error');
        };
        
        recognition.onend = () => {
            isListening = false;
            updateMicButton(false);
        };
        
        return recognition;
    }
    
    function startListening() {
        if (!recognition) {
            recognition = initSpeechRecognition();
        }
        
        if (!recognition) {
            if (window.feedbackService) {
                window.feedbackService.showToast('Microphone not supported in this browser', 'error');
            }
            return;
        }
        
        try {
            isListening = true;
            recognition.start();
            updateMicButton(true);
        } catch (e) {
            console.error('Speech recognition start error:', e);
        }
    }
    
    function stopListening() {
        if (recognition && isListening) {
            recognition.stop();
            isListening = false;
            updateMicButton(false);
        }
    }
    
    function updateMicButton(listening, status = null) {
        const micBtn = document.getElementById('micPracticeBtn');
        if (!micBtn) return;
        
        if (status === 'error') {
            micBtn.classList.remove('listening', 'success');
            micBtn.classList.add('error');
            micBtn.innerHTML = '❌ Try Again';
            setTimeout(() => {
                micBtn.classList.remove('error');
                micBtn.innerHTML = '🎤 Practice';
            }, 2000);
        } else if (listening) {
            micBtn.classList.add('listening');
            micBtn.classList.remove('success', 'error');
            micBtn.innerHTML = '🔴 Listening...';
        } else {
            micBtn.classList.remove('listening', 'error');
            micBtn.innerHTML = '🎤 Practice';
        }
    }
    
    function handleSpeechResult(spokenWords) {
        const word = state.soundoutWords[state.currentWordIndex];
        const targetWord = word.word.toLowerCase();
        
        // Extract all individual words from the transcripts
        const allWords = [];
        spokenWords.forEach(transcript => {
            // Split transcript into individual words and clean them
            const words = transcript.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z]/g, '')).filter(w => w.length > 0);
            allWords.push(...words);
        });
        
        // Also add the full transcripts for single-word recognition
        spokenWords.forEach(t => allWords.push(t.toLowerCase().replace(/[^a-z]/g, '')));
        
        console.log('Target word:', targetWord, 'Spoken words:', allWords);
        
        // Check if any of the recognized words match the target
        // STRICT MATCHING: Must be exact or very close phonetically
        const isCorrect = allWords.some(spoken => {
            // Exact match - highest priority
            if (spoken === targetWord) return true;
            
            // Length must be similar (within 1 character)
            if (Math.abs(spoken.length - targetWord.length) > 1) return false;
            
            // For very short words (2-3 chars), require exact match
            if (targetWord.length <= 3) return spoken === targetWord;
            
            // For 4-letter words, allow only 1 edit distance but also check first letter matches
            if (targetWord.length === 4) {
                return spoken[0] === targetWord[0] && levenshteinDistance(spoken, targetWord) <= 1;
            }
            
            // For longer words, allow 2 edit distance but first letter must match
            if (targetWord.length > 4) {
                return spoken[0] === targetWord[0] && levenshteinDistance(spoken, targetWord) <= 2;
            }
            
            return false;
        });
        
        const micBtn = document.getElementById('micPracticeBtn');
        const feedbackEl = document.getElementById('speechFeedback');
        
        // Get the best match word for feedback display
        const displayWord = allWords.find(w => w === targetWord) || allWords[0] || spokenWords[0];
        
        if (isCorrect) {
            // Success!
            if (micBtn) {
                micBtn.classList.add('success');
                micBtn.innerHTML = '✅ Correct!';
            }
            if (feedbackEl) {
                feedbackEl.textContent = `🎉 Perfect! You said "${targetWord}" correctly!`;
                feedbackEl.className = 'speech-feedback success';
            }
            
            // Show celebration
            if (window.feedbackService) {
                window.feedbackService.showConfetti({ particleCount: 100 });
                window.feedbackService.playSuccessSound();
                window.feedbackService.showToast('🎉 Perfect pronunciation!', 'success');
            }
            
            // Track progress
            if (window.progressTracker) {
                window.progressTracker.recordActivity('soundItOut', 'pronunciation', {
                    correct: true,
                    word: targetWord,
                    points: 15
                });
            }
            
            // Reset after delay
            setTimeout(() => {
                updateMicButton(false);
                if (feedbackEl) feedbackEl.className = 'speech-feedback';
            }, 2500);
        } else {
            // Incorrect - encourage retry
            if (feedbackEl) {
                feedbackEl.textContent = `I heard "${displayWord}" - Try saying "${targetWord}" again!`;
                feedbackEl.className = 'speech-feedback error';
            }
            
            if (window.feedbackService) {
                window.feedbackService.showToast(`Almost! Try saying "${targetWord}" again`, 'info');
            }
            
            setTimeout(() => {
                updateMicButton(false);
                if (feedbackEl) feedbackEl.className = 'speech-feedback';
            }, 2000);
        }
    }
    
    // Levenshtein distance for fuzzy matching
    function levenshteinDistance(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    function nextWord() {
        if (state.currentWordIndex < state.soundoutWords.length - 1) {
            state.currentWordIndex++;
            updateSoundOut();
        }
    }

    function prevWord() {
        if (state.currentWordIndex > 0) {
            state.currentWordIndex--;
            updateSoundOut();
        }
    }

    // Hungry Monster Game Functions with Text-Based Questions
    async function loadMonsterGame() {
        showLoading();
        const result = await apiCall('/game/hungry-monster');
        hideLoading();
        
        if (result && result.questions) {
            state.monsterQuestions = result.questions;
            state.currentQuestionIndex = 0;
            state.gameScore = 0;
            showScreen('monster');
            updateMonsterQuestion();
        }
    }

    function updateMonsterQuestion() {
        if (state.monsterQuestions.length === 0) return;
        
        const question = state.monsterQuestions[state.currentQuestionIndex];
        
        // Update the speech bubble with the actual question text
        const speechTextEl = document.getElementById('monsterSpeechText');
        if (speechTextEl) {
            speechTextEl.textContent = question.question || 'Feed me!';
        }
        
        // Update monster emoji based on question
        const monsterEmoji = document.querySelector('.monster-emoji');
        if (monsterEmoji) {
            monsterEmoji.textContent = '👾';
        }
        
        elements.gameProgress.textContent = `Question ${state.currentQuestionIndex + 1} / ${state.monsterQuestions.length}`;
        elements.gameScore.textContent = `Score: ${state.gameScore}`;
        
        // Clear and populate options
        elements.monsterOptions.innerHTML = '';
        question.options.forEach(option => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.dataset.word = option.word;
            card.dataset.id = option.id;
            
            const img = document.createElement('img');
            img.src = option.image;
            img.alt = option.word;
            img.className = 'option-image';
            img.onerror = function() {
                this.src = '/assets/images/apple.webp'; // fallback
            };
            
            const word = document.createElement('div');
            word.className = 'option-word';
            word.textContent = option.word;
            
            card.appendChild(img);
            card.appendChild(word);
            card.addEventListener('click', () => selectMonsterOption(card, option.word, option.id));
            
            elements.monsterOptions.appendChild(card);
        });
        
        elements.gameFeedback.classList.add('hidden');
    }

    async function selectMonsterOption(cardElement, selectedWord, selectedId) {
        // Disable all options
        const allOptions = elements.monsterOptions.querySelectorAll('.option-card');
        allOptions.forEach(opt => opt.style.pointerEvents = 'none');
        
        const question = state.monsterQuestions[state.currentQuestionIndex];
        const isCorrect = selectedWord === question.correctAnswer || selectedId === question.correctAnswer;
        
        if (isCorrect) {
            cardElement.classList.add('correct');
            state.gameScore += 10;
            
            // Visual feedback
            if (window.feedbackService) {
                window.feedbackService.celebrateCorrect('🎉 Yummy! The monster loved it!');
                window.feedbackService.monsterEat();
            }
            
            // Track progress
            if (window.progressTracker) {
                window.progressTracker.recordActivity('hungryMonster', 'answer', {
                    correct: true,
                    points: 10
                });
            }
        } else {
            cardElement.classList.add('incorrect');
            
            // Highlight correct answer
            allOptions.forEach(opt => {
                if (opt.dataset.word === question.correctAnswer || opt.dataset.id === question.correctAnswer) {
                    opt.classList.add('correct');
                }
            });
            
            // Visual feedback
            if (window.feedbackService) {
                window.feedbackService.showWrong(`Oops! The monster wanted ${question.correctAnswer}`);
                window.feedbackService.monsterShake();
            }
            
            // Track progress
            if (window.progressTracker) {
                window.progressTracker.recordActivity('hungryMonster', 'answer', {
                    correct: false,
                    points: 0
                });
            }
        }
        
        elements.gameScore.textContent = `Score: ${state.gameScore}`;
        
        // Move to next question after delay
        setTimeout(() => {
            if (state.currentQuestionIndex < state.monsterQuestions.length - 1) {
                state.currentQuestionIndex++;
                updateMonsterQuestion();
            } else {
                // Game complete
                if (window.feedbackService) {
                    window.feedbackService.showConfetti({ particleCount: 200 });
                    window.feedbackService.showToast(`🎊 Game Complete! Final Score: ${state.gameScore}`, 'achievement', 4000);
                }
                
                // Track game completion
                if (window.progressTracker) {
                    window.progressTracker.recordActivity('hungryMonster', 'gameComplete', {
                        correct: true,
                        score: state.gameScore,
                        points: state.gameScore
                    });
                }
                
                setTimeout(() => {
                    showScreen('dashboard');
                }, 3000);
            }
        }, 2000);
    }

    function showGameFeedback(message, type) {
        elements.gameFeedback.classList.remove('hidden');
        elements.gameFeedback.querySelector('.feedback-content').textContent = message;
        
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            complete: '#9B7FE6'
        };
        
        elements.gameFeedback.style.background = colors[type] || colors.success;
        elements.gameFeedback.style.color = '#FFFFFF';
    }

    // Minimal Pairs Functions with Dynamic Sound Labels
    async function loadMinimalPairs() {
        showLoading();
        const result = await apiCall('/game/minimal-pairs');
        hideLoading();
        
        if (result && result.exercises) {
            state.minimalPairs = result.exercises;
            state.currentPairIndex = 0;
            showScreen('pairs');
            updateMinimalPairs();
        }
    }

    function updateMinimalPairs() {
        if (state.minimalPairs.length === 0) return;
        
        const exercise = state.minimalPairs[state.currentPairIndex];
        
        elements.pairsCategory.textContent = `Sort: ${exercise.category}`;
        
        // Parse sounds from category (e.g., "/p/ vs /b/")
        const soundPairRegex = /\/(.*?)\/ vs \/(.*?)\//;
        const match = exercise.category.match(soundPairRegex);
        const sound1 = match ? match[1] : exercise.sound1 || 'p';
        const sound2 = match ? match[2] : exercise.sound2 || 'b';
        
        // Create dynamic drop zones
        const sortingArea = document.getElementById('sortingArea');
        if (sortingArea) {
            sortingArea.innerHTML = `
                <div class="drop-zone" data-phoneme="/${sound1}/">
                    <button class="sound-label" onclick="playPhoneme('${sound1}')" aria-label="Play /${sound1}/ sound">
                        <span class="sound-icon">🔊</span> /${sound1}/ Sound
                    </button>
                    <div class="drop-content" id="bucket-${sound1}" data-phoneme="/${sound1}/"></div>
                </div>
                <div class="drop-zone" data-phoneme="/${sound2}/">
                    <button class="sound-label" onclick="playPhoneme('${sound2}')" aria-label="Play /${sound2}/ sound">
                        <span class="sound-icon">🔊</span> /${sound2}/ Sound
                    </button>
                    <div class="drop-content" id="bucket-${sound2}" data-phoneme="/${sound2}/"></div>
                </div>
            `;
            
            // Update bucket references
            elements.bucketP = document.getElementById(`bucket-${sound1}`);
            elements.bucketB = document.getElementById(`bucket-${sound2}`);
        }
        
        // Clear words container
        elements.wordsToSort.innerHTML = '';
        
        // Populate words to sort with sound-out button
        exercise.words.forEach(wordObj => {
            const chip = document.createElement('div');
            chip.className = 'word-chip';
            chip.dataset.word = wordObj.word;
            chip.dataset.phoneme = wordObj.phoneme;
            chip.dataset.audio = wordObj.audio;
            chip.draggable = true;
            
            chip.innerHTML = `
                <span class="word-text">${wordObj.word}</span>
                <button class="sound-out-btn" onclick="event.stopPropagation(); playWordAudio('${wordObj.word}', '${wordObj.audio}')" aria-label="Play word sound">
                    🔊
                </button>
            `;
            
            chip.addEventListener('dragstart', handleDragStart);
            chip.addEventListener('dragend', handleDragEnd);
            
            elements.wordsToSort.appendChild(chip);
        });
        
        // Setup drop zones
        setupDropZones();
        
        elements.pairsFeedback.classList.add('hidden');
    }

    // Play phoneme sound using audio files or Web Audio API
    window.playPhoneme = function(phoneme) {
        const button = document.querySelector(`[onclick*="playPhoneme('${phoneme}')"]`);
        if (button) {
            button.classList.add('playing');
            setTimeout(() => button.classList.remove('playing'), 600);
        }
        
        // Phoneme pronunciations for TTS fallback
        const phonemePronunciations = {
            'p': 'puh', 'b': 'buh', 't': 'tuh', 'd': 'duh',
            'k': 'kuh', 'g': 'guh', 'f': 'fuh', 'v': 'vuh'
        };
        
        // Try to play audio file first
        const audioPath = `/assets/audio/${phoneme.toLowerCase()}-sound.mp3`;
        const audio = new Audio(audioPath);
        
        audio.play().catch(() => {
            // Fallback: Use speech synthesis with phoneme pronunciation
            if ('speechSynthesis' in window) {
                const pronunciation = phonemePronunciations[phoneme.toLowerCase()] || phoneme;
                const utterance = new SpeechSynthesisUtterance(pronunciation);
                utterance.rate = 0.7;
                utterance.pitch = 1.0;
                speechSynthesis.speak(utterance);
            }
        });
    };

    // Play word audio
    window.playWordAudio = function(word, audioPath) {
        // Construct correct audio path from word
        const correctPath = `/assets/audio/${word.toLowerCase()}.mp3`;
        const audio = new Audio(correctPath);
        
        audio.play().catch(() => {
            // Try the provided path as fallback
            const fallbackAudio = new Audio(audioPath);
            fallbackAudio.play().catch(() => {
                // Final fallback: use speech synthesis
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(word);
                    utterance.rate = 0.8;
                    speechSynthesis.speak(utterance);
                }
            });
        });
    };

    function handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.word);
        e.dataTransfer.setData('phoneme', e.target.dataset.phoneme);
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function setupDropZones() {
        const zones = document.querySelectorAll('.drop-content');
        
        zones.forEach(zone => {
            if (!zone) return;
            
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                zone.parentElement.classList.add('drag-over');
            });
            
            zone.addEventListener('dragleave', () => {
                zone.parentElement.classList.remove('drag-over');
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.parentElement.classList.remove('drag-over');
                
                const word = e.dataTransfer.getData('text/plain');
                
                const chip = document.querySelector(`.word-chip[data-word="${word}"]`);
                if (chip) {
                    zone.appendChild(chip);
                }
            });
        });
    }

    function checkPairsAnswers() {
        const exercise = state.minimalPairs[state.currentPairIndex];
        let correct = 0;
        let total = exercise.words.length;
        
        // Check each word
        exercise.words.forEach(wordObj => {
            const chip = document.querySelector(`.word-chip[data-word="${wordObj.word}"]`);
            if (!chip) return;
            
            const parent = chip.parentElement;
            const expectedPhoneme = wordObj.phoneme;
            const actualBucket = parent ? parent.dataset.phoneme : null;
            
            if (expectedPhoneme === actualBucket) {
                chip.classList.add('correct');
                correct++;
                
                // Track correct sort
                if (window.progressTracker) {
                    window.progressTracker.recordActivity('minimalPairs', 'sort', {
                        correct: true,
                        pairCategory: exercise.category,
                        points: 5
                    });
                }
            } else {
                chip.classList.add('incorrect');
                
                // Track incorrect sort
                if (window.progressTracker) {
                    window.progressTracker.recordActivity('minimalPairs', 'sort', {
                        correct: false,
                        pairCategory: exercise.category,
                        points: 0
                    });
                }
            }
        });
        
        // Show feedback with confetti for perfect/good scores
        elements.pairsFeedback.classList.remove('hidden');
        
        const accuracy = Math.round((correct / total) * 100);
        
        if (accuracy === 100) {
            elements.pairsFeedback.textContent = `🎉 Perfect! ${correct}/${total} correct!`;
            elements.pairsFeedback.className = 'pairs-feedback success';
            
            // Show confetti celebration like hungry monster
            if (window.feedbackService) {
                window.feedbackService.showConfetti({ particleCount: 200 });
                window.feedbackService.playSuccessSound();
                window.feedbackService.showToast('🎊 Perfect Score!', 'achievement', 3000);
            }
        } else if (accuracy >= 50) {
            elements.pairsFeedback.textContent = `👍 Good job! ${correct}/${total} correct`;
            elements.pairsFeedback.className = 'pairs-feedback good';
            
            if (window.feedbackService) {
                window.feedbackService.showConfetti({ particleCount: 80 });
                window.feedbackService.playSuccessSound();
                window.feedbackService.showToast(`Nice work! ${correct}/${total}`, 'success');
            }
        } else {
            elements.pairsFeedback.textContent = `Keep practicing! ${correct}/${total} correct`;
            elements.pairsFeedback.className = 'pairs-feedback';
            if (window.feedbackService) {
                window.feedbackService.showToast(`${correct}/${total} - Try again!`, 'info');
            }
        }
        
        // Move to next exercise after delay
        setTimeout(() => {
            if (state.currentPairIndex < state.minimalPairs.length - 1) {
                state.currentPairIndex++;
                updateMinimalPairs();
            } else {
                elements.pairsFeedback.textContent = '🎉 All exercises complete!';
                elements.pairsFeedback.className = 'pairs-feedback success';
                if (window.feedbackService) {
                    window.feedbackService.showConfetti({ particleCount: 250 });
                    window.feedbackService.playAchievementSound();
                    window.feedbackService.showToast('🏆 Module Complete!', 'achievement', 4000);
                }
                setTimeout(() => {
                    showScreen('dashboard');
                }, 3000);
            }
        }, 3000);
    }

    // Event Listeners
    function initEventListeners() {
        // Start Screen
        if (elements.startBtn) {
            elements.startBtn.addEventListener('click', startSession);
        }
        
        if (elements.userName) {
            elements.userName.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') startSession();
            });
        }
        
        // Dashboard
        if (elements.homeBtn) {
            elements.homeBtn.addEventListener('click', () => showScreen('dashboard'));
        }
        
        // Logout button
        if (elements.logoutBtn) {
            elements.logoutBtn.addEventListener('click', () => {
                if (window.authService) {
                    window.authService.logout();
                }
                window.handleAppLogout();
            });
        }
        
        elements.backBtns.forEach(btn => {
            btn.addEventListener('click', () => showScreen('dashboard'));
        });
        
        elements.moduleCards.forEach(card => {
            card.addEventListener('click', () => {
                const module = card.dataset.module;
                navigateToModule(module);
            });
        });
        
        // Flashcards
        if (elements.playSoundBtn) {
            elements.playSoundBtn.addEventListener('click', playCardSound);
        }
        
        if (elements.nextCardBtn) {
            elements.nextCardBtn.addEventListener('click', nextCard);
        }
        
        if (elements.prevCardBtn) {
            elements.prevCardBtn.addEventListener('click', prevCard);
        }
        
        // Sound It Out
        if (elements.playBlendBtn) {
            elements.playBlendBtn.addEventListener('click', playBlendSound);
        }
        
        if (elements.blendSlider) {
            elements.blendSlider.addEventListener('input', handleSliderChange);
        }
        
        // Microphone practice button (dynamic)
        document.addEventListener('click', (e) => {
            if (e.target.id === 'micPracticeBtn' || e.target.closest('#micPracticeBtn')) {
                if (isListening) {
                    stopListening();
                } else {
                    startListening();
                }
            }
        });
        
        if (elements.nextWordBtn) {
            elements.nextWordBtn.addEventListener('click', nextWord);
        }
        
        if (elements.prevWordBtn) {
            elements.prevWordBtn.addEventListener('click', prevWord);
        }
        
        // Minimal Pairs
        if (elements.checkPairsBtn) {
            elements.checkPairsBtn.addEventListener('click', checkPairsAnswers);
        }
    }

    // Initialize Application
    function init() {
        console.log('SoundSteps Application Initialized');
        initEventListeners();
        
        // Check if auth system is available
        if (window.authService && window.authService.isAuthenticated()) {
            // User is already authenticated, go to dashboard
            const user = window.authService.currentUser;
            if (user) {
                state.userName = user.username || 'Guest';
                updateUserBadge(user);
            }
            showScreen('dashboard');
            elements.welcomeMessage.textContent = `Welcome, ${state.userName}!`;
        } else {
            // Show auth screen (handled by init.js)
            showScreen('auth');
        }
    }
    
    // Update user badge in header
    function updateUserBadge(user) {
        const badge = document.getElementById('userBadge');
        if (badge && user) {
            const isGuest = user.is_guest;
            badge.textContent = isGuest ? `👤 ${user.username}` : `⭐ ${user.username}`;
            badge.classList.toggle('guest', isGuest);
        }
    }
    
    // Called by auth system after successful login
    window.initMainApp = function(user, authService) {
        console.log('Main app initialized with user:', user.username);
        state.userName = user.username || 'Guest';
        state.sessionId = user.id;
        
        // Update UI
        updateUserBadge(user);
        elements.welcomeMessage.textContent = `Welcome, ${state.userName}!`;
        
        // Hide auth screen and show dashboard
        const authScreen = document.getElementById('authScreen');
        if (authScreen) {
            authScreen.classList.add('hidden');
        }
        showScreen('dashboard');
    };
    
    // Handle logout
    window.handleAppLogout = function() {
        // Reset state
        state.sessionId = null;
        state.userName = 'Guest';
        state.flashcards = [];
        state.currentCardIndex = 0;
        state.soundoutWords = [];
        state.currentWordIndex = 0;
        state.monsterQuestions = [];
        state.currentQuestionIndex = 0;
        state.gameScore = 0;
        
        // Show auth screen
        showScreen('auth');
        
        // Re-initialize auth UI
        if (window.authUI) {
            const authContent = document.getElementById('authContent');
            if (authContent) {
                window.authUI.renderLoginScreen();
            }
        }
    };

    // Start app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
