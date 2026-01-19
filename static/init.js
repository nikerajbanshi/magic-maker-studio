/**
 * SoundSteps - Application Initialization with Authentication
 * Entry point that handles auth flow and app initialization
 */

(function() {
    'use strict';

    console.log('[init.js] Script loaded');

    /**
     * Initialize the application
     */
    function initializeApp() {
        console.log('[init.js] initializeApp called');
        console.log('[init.js] AuthService available:', typeof AuthService !== 'undefined');
        console.log('[init.js] AuthUI available:', typeof AuthUI !== 'undefined');
        
        // Initialize authentication service
        const authService = new AuthService();
        console.log('[init.js] AuthService created');
        
        // Get auth content container specifically
        const authContent = document.getElementById('authContent');
        console.log('[init.js] authContent element:', authContent);
        
        if (!authContent) {
            console.error('[init.js] Auth content container not found!');
            return;
        }
        
        // Make authService globally available
        window.authService = authService;
        
        // Initialize auth UI in the auth content container
        const authUI = new AuthUI(authService, authContent);
        console.log('[init.js] AuthUI created');
        
        // Make authUI globally available
        window.authUI = authUI;
        
        /**
         * Start main application after successful authentication
         */
        function startApp(user) {
            console.log('Starting app for user:', user.username);
            
            // Update state with user info
            window.appState = window.appState || {};
            window.appState.currentUser = user;
            window.appState.authService = authService;
            
            // Initialize progress tracker
            if (typeof ProgressTracker !== 'undefined') {
                window.progressTracker = new ProgressTracker(user.id);
                console.log('[init.js] Progress tracker initialized for user:', user.id);
            }
            
            // Initialize leaderboard service
            if (typeof LeaderboardService !== 'undefined') {
                window.leaderboardService = new LeaderboardService();
                console.log('[init.js] Leaderboard service initialized');
            }
            
            // Listen for achievement events
            window.addEventListener('achievementUnlocked', (e) => {
                if (window.feedbackService) {
                    window.feedbackService.showAchievementUnlock(e.detail.title, e.detail.message);
                }
            });
            
            // Update leaderboard periodically
            window.addEventListener('progressUpdate', () => {
                if (window.progressTracker && window.leaderboardService) {
                    const entry = window.progressTracker.getLeaderboardEntry();
                    window.leaderboardService.updateLeaderboard(entry);
                }
            });
            
            // Initialize main app
            if (window.initMainApp) {
                window.initMainApp(user, authService);
            } else {
                console.error('Main app initialization function not found');
            }
        }
        
        /**
         * Handle logout
         */
        async function handleLogout() {
            const confirmLogout = confirm('Are you sure you want to logout?');
            if (!confirmLogout) return;
            
            await authService.logout();
            
            // Clear app state
            if (window.appState) {
                window.appState.currentUser = null;
            }
            
            // Reload page to show auth screen
            window.location.reload();
        }
        
        // Set login success callback
        authUI.setOnLoginSuccess(startApp);
        
        // Expose logout function globally
        window.handleAppLogout = handleLogout;
        
        // Initialize auth UI
        authUI.init();
        
        console.log('Auth system initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

})();
