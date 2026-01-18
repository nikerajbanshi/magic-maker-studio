/**
 * Progress Tracking Service
 * Handles user progress persistence and gamification
 */

(function(window) {
    'use strict';

    class ProgressTracker {
        constructor(userId) {
            this.userId = userId || 'guest';
            this.storageKey = `userProgress_${this.userId}`;
            this.data = null;
            this.loadProgress();
        }

        /**
         * Initialize progress data structure
         */
        initializeProgress() {
            return {
                userId: this.userId,
                createdAt: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                
                modules: {
                    flashcards: {
                        lettersCompleted: [],
                        totalAttempts: 0,
                        correctAttempts: 0,
                        masteryLevel: 0,
                        timeSpentSeconds: 0
                    },
                    soundItOut: {
                        wordsCompleted: 0,
                        totalAttempts: 0,
                        correctAttempts: 0,
                        accuracy: 0,
                        averageTimePerWord: 0,
                        masteryLevel: 0
                    },
                    hungryMonster: {
                        gamesPlayed: 0,
                        correctAnswers: 0,
                        totalAnswers: 0,
                        accuracy: 0,
                        highScore: 0,
                        masteryLevel: 0
                    },
                    minimalPairs: {
                        pairsCompleted: [],
                        totalSorts: 0,
                        correctSorts: 0,
                        accuracy: 0,
                        masteryLevel: 0
                    }
                },
                
                overallProgress: {
                    totalTimeSpent: 0,
                    activitiesCompleted: 0,
                    currentStreak: 0,
                    lastPlayDate: null,
                    achievements: [],
                    totalScore: 0
                }
            };
        }

        /**
         * Load progress from localStorage
         */
        loadProgress() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                if (stored) {
                    this.data = JSON.parse(stored);
                    // Check streak
                    this.checkStreak();
                } else {
                    this.data = this.initializeProgress();
                    this.saveProgress();
                }
            } catch (error) {
                console.error('Error loading progress:', error);
                this.data = this.initializeProgress();
            }
        }

        /**
         * Save progress to localStorage
         */
        saveProgress() {
            try {
                this.data.lastActive = new Date().toISOString();
                localStorage.setItem(this.storageKey, JSON.stringify(this.data));
                
                // Emit progress update event
                window.dispatchEvent(new CustomEvent('progressUpdate', {
                    detail: { progress: this.data }
                }));
            } catch (error) {
                console.error('Error saving progress:', error);
            }
        }

        /**
         * Check and update daily streak
         */
        checkStreak() {
            const today = new Date().toDateString();
            const lastPlay = this.data.overallProgress.lastPlayDate;
            
            if (!lastPlay) {
                this.data.overallProgress.currentStreak = 1;
            } else {
                const lastPlayDate = new Date(lastPlay).toDateString();
                const yesterday = new Date(Date.now() - 86400000).toDateString();
                
                if (lastPlayDate === today) {
                    // Same day, no change
                } else if (lastPlayDate === yesterday) {
                    // Consecutive day, increase streak
                    this.data.overallProgress.currentStreak++;
                } else {
                    // Streak broken, reset
                    this.data.overallProgress.currentStreak = 1;
                }
            }
            
            this.data.overallProgress.lastPlayDate = today;
        }

        /**
         * Record activity completion
         */
        recordActivity(module, activity, result) {
            if (!this.data.modules[module]) {
                console.error(`Unknown module: ${module}`);
                return;
            }

            const moduleData = this.data.modules[module];
            
            switch(module) {
                case 'flashcards':
                    this.recordFlashcardActivity(moduleData, activity, result);
                    break;
                case 'soundItOut':
                    this.recordSoundOutActivity(moduleData, activity, result);
                    break;
                case 'hungryMonster':
                    this.recordMonsterActivity(moduleData, activity, result);
                    break;
                case 'minimalPairs':
                    this.recordPairsActivity(moduleData, activity, result);
                    break;
            }

            // Update overall progress
            this.data.overallProgress.activitiesCompleted++;
            if (result.correct) {
                this.data.overallProgress.totalScore += result.points || 10;
            }
            
            // Check for achievements
            this.checkAchievements();
            
            this.saveProgress();
        }

        /**
         * Record flashcard activity
         */
        recordFlashcardActivity(moduleData, activity, result) {
            moduleData.totalAttempts++;
            
            if (result.correct) {
                moduleData.correctAttempts++;
                if (result.letter && !moduleData.lettersCompleted.includes(result.letter)) {
                    moduleData.lettersCompleted.push(result.letter);
                }
            }
            
            // Calculate mastery (letters completed / 26)
            moduleData.masteryLevel = Math.round((moduleData.lettersCompleted.length / 26) * 100);
        }

        /**
         * Record sound out activity
         */
        recordSoundOutActivity(moduleData, activity, result) {
            moduleData.totalAttempts++;
            
            if (result.correct) {
                moduleData.correctAttempts++;
                moduleData.wordsCompleted++;
            }
            
            moduleData.accuracy = Math.round((moduleData.correctAttempts / moduleData.totalAttempts) * 100);
            moduleData.masteryLevel = Math.min(100, Math.round(moduleData.wordsCompleted * 5)); // 20 words = 100%
        }

        /**
         * Record hungry monster activity
         */
        recordMonsterActivity(moduleData, activity, result) {
            moduleData.totalAnswers++;
            
            if (result.correct) {
                moduleData.correctAnswers++;
            }
            
            if (activity === 'gameComplete') {
                moduleData.gamesPlayed++;
                if (result.score > moduleData.highScore) {
                    moduleData.highScore = result.score;
                }
            }
            
            moduleData.accuracy = Math.round((moduleData.correctAnswers / moduleData.totalAnswers) * 100);
            moduleData.masteryLevel = Math.min(100, Math.round(moduleData.gamesPlayed * 10 + moduleData.accuracy / 2));
        }

        /**
         * Record minimal pairs activity
         */
        recordPairsActivity(moduleData, activity, result) {
            moduleData.totalSorts++;
            
            if (result.correct) {
                moduleData.correctSorts++;
            }
            
            if (result.pairCategory && !moduleData.pairsCompleted.includes(result.pairCategory)) {
                moduleData.pairsCompleted.push(result.pairCategory);
            }
            
            moduleData.accuracy = Math.round((moduleData.correctSorts / moduleData.totalSorts) * 100);
            moduleData.masteryLevel = Math.min(100, moduleData.pairsCompleted.length * 25); // 4 pairs = 100%
        }

        /**
         * Check for new achievements
         */
        checkAchievements() {
            const achievements = this.data.overallProgress.achievements;
            const modules = this.data.modules;
            
            // First login
            if (!achievements.includes('first_login')) {
                achievements.push('first_login');
                this.showAchievement('🎉 Welcome!', 'You started your learning journey!');
            }
            
            // Complete alphabet
            if (modules.flashcards.lettersCompleted.length >= 26 && !achievements.includes('complete_alphabet')) {
                achievements.push('complete_alphabet');
                this.showAchievement('🔤 ABC Master!', 'You learned all 26 letters!');
            }
            
            // Perfect game (monster)
            if (modules.hungryMonster.accuracy >= 100 && modules.hungryMonster.gamesPlayed > 0 && !achievements.includes('perfect_game')) {
                achievements.push('perfect_game');
                this.showAchievement('⭐ Perfect Game!', 'You got every answer right!');
            }
            
            // 3 day streak
            if (this.data.overallProgress.currentStreak >= 3 && !achievements.includes('streak_3')) {
                achievements.push('streak_3');
                this.showAchievement('🔥 On Fire!', '3 day learning streak!');
            }
            
            // 7 day streak
            if (this.data.overallProgress.currentStreak >= 7 && !achievements.includes('streak_7')) {
                achievements.push('streak_7');
                this.showAchievement('🏆 Week Warrior!', '7 day learning streak!');
            }
            
            // High score (500+)
            if (this.data.overallProgress.totalScore >= 500 && !achievements.includes('score_500')) {
                achievements.push('score_500');
                this.showAchievement('💰 Point Collector!', 'You earned 500 points!');
            }
        }

        /**
         * Show achievement notification
         */
        showAchievement(title, message) {
            // Dispatch achievement event
            window.dispatchEvent(new CustomEvent('achievementUnlocked', {
                detail: { title, message }
            }));
        }

        /**
         * Get mastery level for a module
         */
        getMasteryLevel(module) {
            if (this.data.modules[module]) {
                return this.data.modules[module].masteryLevel;
            }
            return 0;
        }

        /**
         * Get overall stats
         */
        getOverallStats() {
            return {
                totalScore: this.data.overallProgress.totalScore,
                activitiesCompleted: this.data.overallProgress.activitiesCompleted,
                currentStreak: this.data.overallProgress.currentStreak,
                achievements: this.data.overallProgress.achievements.length,
                averageMastery: this.calculateAverageMastery()
            };
        }

        /**
         * Calculate average mastery across all modules
         */
        calculateAverageMastery() {
            const modules = this.data.modules;
            const total = modules.flashcards.masteryLevel +
                         modules.soundItOut.masteryLevel +
                         modules.hungryMonster.masteryLevel +
                         modules.minimalPairs.masteryLevel;
            return Math.round(total / 4);
        }

        /**
         * Get data for leaderboard
         */
        getLeaderboardEntry() {
            return {
                userId: this.userId,
                username: window.appState?.currentUser?.username || 'Guest',
                isGuest: window.appState?.currentUser?.is_guest || true,
                totalScore: this.data.overallProgress.totalScore,
                masteryAverage: this.calculateAverageMastery(),
                activitiesCompleted: this.data.overallProgress.activitiesCompleted,
                achievements: this.data.overallProgress.achievements.length,
                lastUpdated: new Date().toISOString()
            };
        }
    }

    // Export ProgressTracker
    window.ProgressTracker = ProgressTracker;

})(window);
