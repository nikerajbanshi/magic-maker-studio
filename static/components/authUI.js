/**
 * Authentication UI Component
 * Handles rendering and interaction for login, register, and guest screens
 */

(function(window) {
    'use strict';

    class AuthUI {
        constructor(authService, container) {
            this.authService = authService;
            this.container = container;
            this.currentView = 'login'; // 'login', 'register', 'guest'
        }

        /**
         * Render login screen
         */
        renderLoginScreen() {
            console.log('[authUI] renderLoginScreen() called');
            console.log('[authUI] container element:', this.container);
            this.currentView = 'login';
            this.container.innerHTML = `
                <div class="logo">
                    <h1 class="brand-title">SoundSteps</h1>
                    <span class="sparkle">✨</span>
                </div>
                <h2 class="auth-title">Welcome Back!</h2>
                <p class="auth-subtitle">Login to continue your learning journey</p>
                
                <form id="loginForm" class="auth-form">
                    <div class="form-group">
                        <label for="loginEmail">Email or Username</label>
                        <input 
                            type="text" 
                            id="loginEmail" 
                            name="email"
                            class="form-input" 
                            placeholder="Enter your email or username"
                            required
                            autocomplete="username"
                        >
                    </div>
                    
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input 
                            type="password" 
                            id="loginPassword" 
                            name="password"
                            class="form-input" 
                            placeholder="Enter your password"
                            required
                            autocomplete="current-password"
                        >
                    </div>
                    
                    <div id="loginError" class="error-message hidden"></div>
                    
                    <button type="submit" class="btn btn-primary btn-large" id="loginBtn">
                        Login
                    </button>
                </form>
                
                <div class="auth-divider">
                    <span>OR</span>
                </div>
                
                <button id="guestBtn" class="btn btn-secondary btn-large">
                    🎮 Continue as Guest
                </button>
                
                <div class="auth-links">
                    <p>Don't have an account? 
                        <a href="#" id="showRegisterBtn" class="link-primary">Sign Up</a>
                    </p>
                </div>
            `;

            this.attachLoginHandlers();
        }

        /**
         * Render register screen
         */
        renderRegisterScreen() {
            this.currentView = 'register';
            this.container.innerHTML = `
                <div class="logo">
                    <h1 class="brand-title">SoundSteps</h1>
                    <span class="sparkle">✨</span>
                </div>
                <h2 class="auth-title">Create Account</h2>
                <p class="auth-subtitle">Start your phonics learning adventure!</p>
                
                <form id="registerForm" class="auth-form">
                    <div class="form-group">
                        <label for="registerUsername">Username</label>
                        <input 
                            type="text" 
                            id="registerUsername" 
                            name="username"
                            class="form-input" 
                            placeholder="Choose a username (3-20 characters)"
                            minlength="3"
                            maxlength="20"
                            required
                            autocomplete="username"
                        >
                        <small class="form-hint">Letters, numbers, and underscores only</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="registerEmail">Email</label>
                        <input 
                            type="email" 
                            id="registerEmail" 
                            name="email"
                            class="form-input" 
                            placeholder="Enter your email"
                            required
                            autocomplete="email"
                        >
                    </div>
                    
                    <div class="form-group">
                        <label for="registerPassword">Password</label>
                        <input 
                            type="password" 
                            id="registerPassword" 
                            name="password"
                            class="form-input" 
                            placeholder="Create a password (min 8 characters)"
                            minlength="8"
                            required
                            autocomplete="new-password"
                        >
                        <small class="form-hint">At least 8 characters</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="registerConfirmPassword">Confirm Password</label>
                        <input 
                            type="password" 
                            id="registerConfirmPassword" 
                            name="confirmPassword"
                            class="form-input" 
                            placeholder="Confirm your password"
                            minlength="8"
                            required
                            autocomplete="new-password"
                        >
                    </div>
                    
                    <div id="registerError" class="error-message hidden"></div>
                    
                    <button type="submit" class="btn btn-primary btn-large" id="registerBtn">
                        Create Account
                    </button>
                </form>
                
                <div class="auth-links">
                    <p>Already have an account? 
                        <a href="#" id="showLoginBtn" class="link-primary">Login</a>
                    </p>
                </div>
            `;

            this.attachRegisterHandlers();
        }

        /**
         * Attach login form handlers
         */
        attachLoginHandlers() {
            const form = document.getElementById('loginForm');
            const guestBtn = document.getElementById('guestBtn');
            const showRegisterBtn = document.getElementById('showRegisterBtn');
            const errorDiv = document.getElementById('loginError');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value.trim();
                const password = document.getElementById('loginPassword').value;

                if (!email || !password) {
                    this.showError(errorDiv, 'Please fill in all fields');
                    return;
                }

                this.showLoading('loginBtn', 'Logging in...');
                errorDiv.classList.add('hidden');

                const result = await this.authService.login(email, password);

                if (result.success) {
                    // Trigger success callback
                    if (this.onLoginSuccess) {
                        this.onLoginSuccess(result.user);
                    }
                } else {
                    this.hideLoading('loginBtn', 'Login');
                    this.showError(errorDiv, result.error || 'Login failed. Please try again.');
                }
            });

            guestBtn.addEventListener('click', async () => {
                this.showLoading('guestBtn', 'Starting...');
                const result = await this.authService.guestLogin();
                
                if (result.success) {
                    if (this.onLoginSuccess) {
                        this.onLoginSuccess(result.user);
                    }
                } else {
                    this.hideLoading('guestBtn', '🎮 Continue as Guest');
                    alert('Failed to start guest session. Please try again.');
                }
            });

            showRegisterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.renderRegisterScreen();
            });
        }

        /**
         * Attach register form handlers
         */
        attachRegisterHandlers() {
            const form = document.getElementById('registerForm');
            const showLoginBtn = document.getElementById('showLoginBtn');
            const errorDiv = document.getElementById('registerError');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('registerUsername').value.trim();
                const email = document.getElementById('registerEmail').value.trim();
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('registerConfirmPassword').value;

                // Validation
                if (!username || !email || !password || !confirmPassword) {
                    this.showError(errorDiv, 'Please fill in all fields');
                    return;
                }

                if (username.length < 3 || username.length > 20) {
                    this.showError(errorDiv, 'Username must be 3-20 characters');
                    return;
                }

                if (password.length < 8) {
                    this.showError(errorDiv, 'Password must be at least 8 characters');
                    return;
                }

                if (password !== confirmPassword) {
                    this.showError(errorDiv, 'Passwords do not match');
                    return;
                }

                this.showLoading('registerBtn', 'Creating Account...');
                errorDiv.classList.add('hidden');

                const result = await this.authService.register(username, email, password);

                if (result.success) {
                    // Trigger success callback
                    if (this.onLoginSuccess) {
                        this.onLoginSuccess(result.user);
                    }
                } else {
                    this.hideLoading('registerBtn', 'Create Account');
                    this.showError(errorDiv, result.error || 'Registration failed. Please try again.');
                }
            });

            showLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.renderLoginScreen();
            });
        }

        /**
         * Show error message
         */
        showError(element, message) {
            element.textContent = message;
            element.classList.remove('hidden');
        }

        /**
         * Show loading state
         */
        showLoading(buttonId, text) {
            const button = document.getElementById(buttonId);
            if (button) {
                button.disabled = true;
                button.innerHTML = `<span class="spinner"></span> ${text}`;
            }
        }

        /**
         * Hide loading state
         */
        hideLoading(buttonId, text) {
            const button = document.getElementById(buttonId);
            if (button) {
                button.disabled = false;
                button.textContent = text;
            }
        }

        /**
         * Set callback for successful login
         */
        setOnLoginSuccess(callback) {
            this.onLoginSuccess = callback;
        }

        /**
         * Initialize auth UI
         */
        init() {
            console.log('[authUI] init() called');
            console.log('[authUI] container:', this.container);
            console.log('[authUI] authService:', this.authService);
            console.log('[authUI] isAuthenticated:', this.authService.isAuthenticated());
            
            // Check if already authenticated
            if (this.authService.isAuthenticated()) {
                console.log('[authUI] User already authenticated, calling onLoginSuccess');
                if (this.onLoginSuccess) {
                    this.onLoginSuccess(this.authService.getCurrentUser());
                }
            } else {
                console.log('[authUI] User not authenticated, rendering login screen');
                this.renderLoginScreen();
            }
        }
    }

    // Export AuthUI
    window.AuthUI = AuthUI;

})(window);
