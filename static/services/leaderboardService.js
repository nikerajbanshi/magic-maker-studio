/**
 * Leaderboard Service
 * Handles leaderboard data storage and retrieval
 */

(function(window) {
    'use strict';

    class LeaderboardService {
        constructor() {
            this.storageKey = 'globalLeaderboard';
            this.data = null;
            this.loadLeaderboard();
        }

        /**
         * Initialize leaderboard data structure
         */
        initializeLeaderboard() {
            return {
                leaderboard: [],
                lastUpdated: new Date().toISOString()
            };
        }

        /**
         * Load leaderboard from localStorage
         */
        loadLeaderboard() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                if (stored) {
                    this.data = JSON.parse(stored);
                } else {
                    this.data = this.initializeLeaderboard();
                    this.saveLeaderboard();
                }
            } catch (error) {
                console.error('Error loading leaderboard:', error);
                this.data = this.initializeLeaderboard();
            }
        }

        /**
         * Save leaderboard to localStorage
         */
        saveLeaderboard() {
            try {
                this.data.lastUpdated = new Date().toISOString();
                localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            } catch (error) {
                console.error('Error saving leaderboard:', error);
            }
        }

        /**
         * Update or add user to leaderboard
         */
        updateLeaderboard(entry) {
            const existingIndex = this.data.leaderboard.findIndex(e => e.userId === entry.userId);
            
            if (existingIndex >= 0) {
                // Update existing entry
                this.data.leaderboard[existingIndex] = {
                    ...this.data.leaderboard[existingIndex],
                    ...entry,
                    lastUpdated: new Date().toISOString()
                };
            } else {
                // Add new entry
                this.data.leaderboard.push({
                    ...entry,
                    lastUpdated: new Date().toISOString()
                });
            }

            // Sort by total score
            this.data.leaderboard.sort((a, b) => b.totalScore - a.totalScore);
            
            // Keep only top 100
            this.data.leaderboard = this.data.leaderboard.slice(0, 100);
            
            this.saveLeaderboard();
        }

        /**
         * Get top N users
         */
        getTop(n = 10) {
            return this.data.leaderboard.slice(0, n);
        }

        /**
         * Get user rank
         */
        getUserRank(userId) {
            const index = this.data.leaderboard.findIndex(e => e.userId === userId);
            return index >= 0 ? index + 1 : null;
        }

        /**
         * Get user entry
         */
        getUserEntry(userId) {
            return this.data.leaderboard.find(e => e.userId === userId);
        }

        /**
         * Get leaderboard filtered by type
         */
        getFiltered(filter = 'all') {
            switch(filter) {
                case 'registered':
                    return this.data.leaderboard.filter(e => !e.isGuest);
                case 'guests':
                    return this.data.leaderboard.filter(e => e.isGuest);
                default:
                    return this.data.leaderboard;
            }
        }

        /**
         * Sort leaderboard by different criteria
         */
        getSorted(sortBy = 'totalScore') {
            const sorted = [...this.data.leaderboard];
            
            switch(sortBy) {
                case 'mastery':
                    sorted.sort((a, b) => b.masteryAverage - a.masteryAverage);
                    break;
                case 'activities':
                    sorted.sort((a, b) => b.activitiesCompleted - a.activitiesCompleted);
                    break;
                case 'achievements':
                    sorted.sort((a, b) => b.achievements - a.achievements);
                    break;
                default:
                    sorted.sort((a, b) => b.totalScore - a.totalScore);
            }
            
            return sorted;
        }
    }

    // Export LeaderboardService
    window.LeaderboardService = LeaderboardService;

})(window);
