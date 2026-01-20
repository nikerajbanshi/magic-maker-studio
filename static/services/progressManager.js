/**
 * Progress Manager - XP, Achievements, and Celebrations
 * Handles module completion, XP awards, achievement unlocks, and celebration popups
 */

(function () {
  "use strict";

  class ProgressManager {
    constructor() {
      this.achievements = null;
      this.xpPerLevel = 500;
      this.loadAchievements();
    }

    async loadAchievements() {
      try {
        const response = await fetch("/api/achievements");
        if (response.ok) {
          this.achievements = await response.json();
          this.xpPerLevel = this.achievements.xpPerLevel || 500;
          console.log("Achievements loaded:", this.achievements);
        }
      } catch (error) {
        console.error("Failed to load achievements:", error);
        // Use defaults
        this.achievements = {
          modules: {},
          xpPerLevel: 500,
        };
      }
    }

    // Get current user data from localStorage
    getCurrentUser() {
      const userData = localStorage.getItem("soundsteps_user");
      if (userData) {
        return JSON.parse(userData);
      }
      return {
        xp: 0,
        totalXP: 0,
        level: 1,
        achievements: [],
        completedModules: [],
      };
    }

    // Save user progress to localStorage
    saveUserProgress(userData) {
      localStorage.setItem("soundsteps_user", JSON.stringify(userData));
    }

    // Complete a module and award XP
    async completeModule(moduleName) {
      console.log("completeModule executing for:", moduleName);

      if (!this.achievements) {
        console.log("Achievements not loaded, loading now...");
        await this.loadAchievements();
      }

      const moduleData = this.achievements?.modules?.[moduleName];
      if (!moduleData) {
        console.warn(
          "No achievement data for module:",
          moduleName,
          "Available modules:",
          Object.keys(this.achievements?.modules || {}),
        );
        // Fallback - still show celebration and redirect
        this.showFallbackCelebration(moduleName);
        return;
      }

      console.log("Module data found:", moduleData);
      const user = this.getCurrentUser();
      console.log("Current user:", user);

      // Check if already completed today
      const today = new Date().toDateString();
      const lastCompletion = localStorage.getItem(
        `${moduleName}_last_completion`,
      );

      if (lastCompletion === today) {
        // Already completed today, show mini celebration without XP
        console.log("Already completed today, showing mini celebration");
        this.showMiniCelebration(moduleName, moduleData.achievement);
        return;
      }

      // Award XP
      const xpAwarded = moduleData.xp;
      user.totalXP = (user.totalXP || 0) + xpAwarded;
      console.log("XP awarded:", xpAwarded, "Total XP:", user.totalXP);

      // Check for level up
      const newLevel = Math.floor(user.totalXP / this.xpPerLevel) + 1;
      const leveledUp = newLevel > (user.level || 1);
      user.level = newLevel;

      // Unlock achievement if not already unlocked
      const achievement = moduleData.achievement;
      let achievementUnlocked = false;

      if (!user.achievements) user.achievements = [];
      if (!user.achievements.find((a) => a.id === achievement.id)) {
        user.achievements.push({
          ...achievement,
          unlockedAt: new Date().toISOString(),
        });
        achievementUnlocked = true;
      }

      // Track completed module
      if (!user.completedModules) user.completedModules = [];
      if (!user.completedModules.includes(moduleName)) {
        user.completedModules.push(moduleName);
      }

      // Save progress
      this.saveUserProgress(user);
      localStorage.setItem(`${moduleName}_last_completion`, today);

      // Show celebration popup
      this.showCompletionCelebration(
        moduleName,
        xpAwarded,
        achievement,
        leveledUp,
        newLevel,
      );

      // Auto-redirect to dashboard after celebration
      setTimeout(() => {
        if (window.showScreen) {
          window.showScreen("dashboard");
        }
        this.updateDashboardStats();
      }, 4500);
    }

    // Fallback celebration when achievements data isn't available
    showFallbackCelebration(moduleName) {
      const xp = 100; // Default XP
      const user = this.getCurrentUser();
      user.totalXP = (user.totalXP || 0) + xp;
      user.level = Math.floor(user.totalXP / this.xpPerLevel) + 1;
      this.saveUserProgress(user);

      const overlay = document.createElement("div");
      overlay.className = "completion-celebration-overlay";
      overlay.innerHTML = `
                <div class="celebration-card">
                    <div class="celebration-confetti" id="celebrationConfetti"></div>
                    <div class="celebration-icon">🎉</div>
                    <h2>🎉 Module Complete! 🎉</h2>
                    <h3>Great Job!</h3>
                    <p>You completed the ${moduleName} module!</p>
                    <div class="xp-award">
                        <span class="xp-badge">+${xp} XP</span>
                    </div>
                    <div class="celebration-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.getLevelProgress()}%"></div>
                        </div>
                        <p class="level-text">Level ${user.level}</p>
                    </div>
                </div>
            `;

      document.body.appendChild(overlay);
      this.launchConfetti();

      setTimeout(() => {
        overlay.classList.add("fade-out");
        setTimeout(() => overlay.remove(), 500);
        if (window.showScreen) {
          window.showScreen("dashboard");
        }
        this.updateDashboardStats();
      }, 4000);
    }

    // Show the celebration popup with confetti
    showCompletionCelebration(moduleName, xp, achievement, leveledUp, level) {
      // Remove any existing celebration
      const existing = document.querySelector(
        ".completion-celebration-overlay",
      );
      if (existing) existing.remove();

      const overlay = document.createElement("div");
      overlay.className = "completion-celebration-overlay";
      overlay.innerHTML = `
                <div class="celebration-card">
                    <div class="celebration-confetti" id="celebrationConfetti"></div>
                    <div class="celebration-icon">${achievement.icon}</div>
                    <h2>🎉 Module Complete! 🎉</h2>
                    <h3>${achievement.name}</h3>
                    <p>${achievement.description}</p>
                    <div class="xp-award">
                        <span class="xp-badge">+${xp} XP</span>
                    </div>
                    ${
                      leveledUp
                        ? `
                        <div class="level-up-badge">
                            🎊 Level Up! You're now Level ${level}!
                        </div>
                    `
                        : ""
                    }
                    <div class="celebration-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.getLevelProgress()}%"></div>
                        </div>
                        <p class="level-text">Level ${level}</p>
                    </div>
                </div>
            `;

      document.body.appendChild(overlay);

      // Trigger confetti
      this.launchConfetti();

      // Play celebration sound
      if (window.feedbackService) {
        window.feedbackService.playAchievementSound();
      }

      // Auto-remove after 4.5 seconds
      setTimeout(() => {
        overlay.classList.add("fade-out");
        setTimeout(() => overlay.remove(), 500);
      }, 4000);
    }

    // Show mini celebration (already completed today)
    showMiniCelebration(moduleName, achievement) {
      if (window.feedbackService) {
        window.feedbackService.showConfetti({ particleCount: 50 });
        window.feedbackService.showToast(
          `${achievement.icon} Great practice! Keep it up!`,
          "success",
          2500,
        );
      }

      setTimeout(() => {
        if (typeof showScreen === "function") {
          showScreen("dashboard");
        }
      }, 2500);
    }

    // Launch confetti animation
    launchConfetti() {
      if (
        window.feedbackService &&
        typeof window.feedbackService.showConfetti === "function"
      ) {
        window.feedbackService.showConfetti({ particleCount: 300 });
      } else {
        // Fallback confetti
        const container = document.getElementById("celebrationConfetti");
        if (container) {
          for (let i = 0; i < 100; i++) {
            this.createConfettiPiece(container);
          }
        }
      }
    }

    createConfettiPiece(container) {
      const confetti = document.createElement("div");
      confetti.className = "confetti-piece";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.background = this.getRandomColor();
      confetti.style.animationDelay = Math.random() * 2 + "s";
      confetti.style.animationDuration = 2 + Math.random() * 2 + "s";
      container.appendChild(confetti);
    }

    getRandomColor() {
      const colors = [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#FFA07A",
        "#98D8C8",
        "#F7DC6F",
        "#9B7FE6",
        "#5DADE2",
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    // Get progress toward next level (0-100%)
    getLevelProgress() {
      const user = this.getCurrentUser();
      const currentLevelXP = user.totalXP % this.xpPerLevel;
      return (currentLevelXP / this.xpPerLevel) * 100;
    }

    // Update dashboard stats display
    updateDashboardStats() {
      const user = this.getCurrentUser();

      // Update basic stats
      const totalPointsEl = document.getElementById("totalPoints");
      const userLevelEl = document.getElementById("userLevel");
      const achievementsCountEl = document.getElementById("achievementsCount");

      if (totalPointsEl) totalPointsEl.textContent = user.totalXP || 0;
      if (userLevelEl) userLevelEl.textContent = `Level ${user.level || 1}`;
      if (achievementsCountEl)
        achievementsCountEl.textContent = user.achievements?.length || 0;

      // Update progress bar
      const progressBar = document.querySelector(
        ".level-progress-bar .progress-fill",
      );
      if (progressBar) {
        progressBar.style.width = this.getLevelProgress() + "%";
      }

      // Render achievement badges
      this.renderAchievementBadges();
    }

    // Render achievement badges in the skills grid
    renderAchievementBadges() {
      const user = this.getCurrentUser();
      const skillsGrid = document.getElementById("skillsGrid");

      if (!skillsGrid || !user.achievements || user.achievements.length === 0) {
        return;
      }

      // Clear existing badges
      const existingBadges = skillsGrid.querySelectorAll(
        ".achievement-badge-earned",
      );
      existingBadges.forEach((badge) => badge.remove());

      // Add new badges
      user.achievements.forEach((achievement) => {
        const badge = document.createElement("div");
        badge.className = "skill-badge unlocked achievement-badge-earned";
        badge.innerHTML = `
                    <span class="skill-icon">${achievement.icon}</span>
                    <span class="skill-name">${achievement.name}</span>
                `;
        badge.title = achievement.description;
        skillsGrid.appendChild(badge);
      });
    }

    // Check if a module has been completed
    isModuleCompleted(moduleName) {
      const user = this.getCurrentUser();
      return user.completedModules?.includes(moduleName) || false;
    }

    // Get total XP
    getTotalXP() {
      return this.getCurrentUser().totalXP || 0;
    }

    // Get current level
    getLevel() {
      return this.getCurrentUser().level || 1;
    }

    // Get all achievements
    getAchievements() {
      return this.getCurrentUser().achievements || [];
    }
  }

  // Create global instance
  window.progressManager = new ProgressManager();

  // Global function for completing modules (called from app.js)
  window.completeModule = function (moduleName) {
    console.log("completeModule called for:", moduleName);
    if (window.progressManager) {
      window.progressManager.completeModule(moduleName);
    } else {
      console.error("progressManager not available");
    }
  };

  console.log("ProgressManager initialized");
})();
