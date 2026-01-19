/**
 * Authentication Service
 * Handles user registration, login, guest access, and token management
 */

(function(window) {
    'use strict';

    const API_BASE = '/api/auth';
    const TOKEN_KEY = 'magicMakerAuth';

    class AuthService {
        constructor() {
            this.currentUser = null;
            this.token = null;
            this.loadFromStorage();
        }

        /**
         * Load auth data from localStorage
         */
        loadFromStorage() {
            try {
                const stored = localStorage.getItem(TOKEN_KEY);
                if (stored) {
                    const data = JSON.parse(stored);
                    this.token = data.token;
                    this.currentUser = data.user;
                    
                    // Check if token is expired (simple check)
                    if (this.isTokenExpired()) {
                        this.clearAuth();
                    }
                }
            } catch (error) {
                console.error('Error loading auth from storage:', error);
                this.clearAuth();
            }
        }

        /**
         * Save auth data to localStorage
         */
        saveToStorage() {
            if (this.token && this.currentUser) {
                const data = {
                    token: this.token,
                    user: this.currentUser,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
            }
        }

        /**
         * Clear auth data
         */
        clearAuth() {
            this.token = null;
            this.currentUser = null;
            localStorage.removeItem(TOKEN_KEY);
        }

        /**
         * Check if token is expired (basic check - 7 days)
         */
        isTokenExpired() {
            try {
                const stored = localStorage.getItem(TOKEN_KEY);
                if (!stored) return true;
                
                const data = JSON.parse(stored);
                const timestamp = new Date(data.timestamp);
                const now = new Date();
                const daysDiff = (now - timestamp) / (1000 * 60 * 60 * 24);
                
                return daysDiff > 7; // Token expires after 7 days
            } catch (error) {
                return true;
            }
        }

        /**
         * Get authorization headers
         */
        getAuthHeaders() {
            if (this.token) {
                return {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                };
            }
            return {
                'Content-Type': 'application/json'
            };
        }

        /**
         * Make authenticated API call
         */
        async apiCall(endpoint, options = {}) {
            try {
                const response = await fetch(`${API_BASE}${endpoint}`, {
                    ...options,
                    headers: {
                        ...this.getAuthHeaders(),
                        ...options.headers
                    }
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || 'API request failed');
                }

                return await response.json();
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        }

        /**
         * Register a new user
         */
        async register(username, email, password) {
            try {
                const result = await this.apiCall('/register', {
                    method: 'POST',
                    body: JSON.stringify({ username, email, password })
                });

                this.token = result.access_token;
                this.currentUser = result.user;
                this.saveToStorage();

                return { success: true, user: result.user };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        /**
         * Login with email/username and password
         */
        async login(emailOrUsername, password) {
            try {
                const result = await this.apiCall('/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email_or_username: emailOrUsername,
                        password: password
                    })
                });

                this.token = result.access_token;
                this.currentUser = result.user;
                this.saveToStorage();

                return { success: true, user: result.user };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        /**
         * Continue as guest
         */
        async guestLogin(name = 'Guest') {
            try {
                const result = await this.apiCall('/guest', {
                    method: 'POST',
                    body: JSON.stringify({ name })
                });

                this.token = result.access_token;
                this.currentUser = result.user;
                this.saveToStorage();

                return { success: true, user: result.user };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        /**
         * Logout current user
         */
        async logout() {
            try {
                // Call logout endpoint (optional)
                await this.apiCall('/logout', { method: 'POST' });
            } catch (error) {
                console.error('Logout API error:', error);
            } finally {
                this.clearAuth();
            }
        }

        /**
         * Check if user is authenticated
         */
        isAuthenticated() {
            return this.token !== null && this.currentUser !== null && !this.isTokenExpired();
        }

        /**
         * Check if current user is guest
         */
        isGuest() {
            return this.currentUser && this.currentUser.is_guest;
        }

        /**
         * Get current user
         */
        getCurrentUser() {
            return this.currentUser;
        }

        /**
         * Get user display name
         */
        getUserDisplayName() {
            if (!this.currentUser) return 'Guest';
            return this.currentUser.username;
        }
    }

    // Export AuthService
    window.AuthService = AuthService;

})(window);
