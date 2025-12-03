/*
 * हमार पढ़ाई - Complete Gamification System
 * Points, Badges, Leaderboard, Streaks, Challenges, Sound & Animations
 * 100% Vanilla JavaScript + LocalStorage Only
 */

// ===== UTILITY: USER ID MANAGER =====
class UserManager {
    constructor() {
        this.userId = this.getOrCreateUserId();
        this.userName = this.getOrCreateUserName();
    }

    getOrCreateUserId() {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', userId);
        }
        return userId;
    }

    getOrCreateUserName() {
        let userName = localStorage.getItem('userName');
        if (!userName) {
            userName = 'छात्र_' + Math.floor(Math.random() * 9999);
            localStorage.setItem('userName', userName);
        }
        return userName;
    }

    setUserName(name) {
        this.userName = name;
        localStorage.setItem('userName', name);
    }
}

// ===== 1. POINTS MANAGER =====
class PointsManager {
    constructor(userId) {
        this.userId = userId;
        this.storageKey = `points_${userId}`;
        this.points = this.loadPoints();
    }

    loadPoints() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? parseInt(saved) : 0;
    }

    savePoints() {
        localStorage.setItem(this.storageKey, this.points);
    }

    awardPoints(amount, reason = '') {
        this.points += amount;
        this.savePoints();
        this.updateUI();
        this.showPointsFeedback(amount, reason);
        return this.points;
    }

    awardCorrectAnswer() {
        return this.awardPoints(10, 'सही जवाब! ✅');
    }

    awardQuizCompletion(score, totalQuestions) {
        const baseBonus = 50;
        const perfectBonus = score === totalQuestions ? 100 : 0;
        const speedBonus = 0; // Can add time-based bonus later
        const total = baseBonus + perfectBonus + speedBonus;
        return this.awardPoints(total, `Quiz पूरा! ${score}/${totalQuestions} 🎉`);
    }

    updateUI() {
        const counterEl = document.querySelector('.points-counter');
        if (counterEl) {
            counterEl.textContent = this.points;
        }
        const detailEl = document.getElementById('totalPoints');
        if (detailEl) {
            detailEl.textContent = this.points;
        }
    }

    showPointsFeedback(amount, reason) {
        const counterEl = document.querySelector('.points-counter');
        if (!counterEl) return;

        const feedback = document.createElement('div');
        feedback.className = 'points-feedback';
        feedback.textContent = `+${amount} अंक`;
        feedback.style.cssText = `
            position: absolute;
            top: -30px;
            right: 0;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 700;
            font-size: 0.9rem;
            animation: pointsFeedback 2s ease forwards;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
        `;

        counterEl.parentElement.style.position = 'relative';
        counterEl.parentElement.appendChild(feedback);

        setTimeout(() => feedback.remove(), 2000);
    }

    getPoints() {
        return this.points;
    }
}

// ===== 2. BADGES MANAGER =====
class BadgeManager {
    constructor(userId) {
        this.userId = userId;
        this.storageKey = `badges_${userId}`;
        this.unlockedBadges = this.loadBadges();
        this.badges = this.defineBadges();
    }

    defineBadges() {
        return [
            {
                id: 'first_quiz',
                name: 'पहला कदम',
                icon: '🎯',
                description: 'पहली Quiz पूरी की',
                condition: (stats) => stats.quizzesCompleted >= 1
            },
            {
                id: 'quiz_master_5',
                name: 'Quiz Master',
                icon: '📚',
                description: '5 Quiz पूरी की',
                condition: (stats) => stats.quizzesCompleted >= 5
            },
            {
                id: 'quiz_legend_20',
                name: 'Quiz Legend',
                icon: '👑',
                description: '20 Quiz पूरी की',
                condition: (stats) => stats.quizzesCompleted >= 20
            },
            {
                id: 'perfect_score',
                name: 'परफेक्ट स्कोर',
                icon: '💯',
                description: '100% स्कोर हासिल किया',
                condition: (stats) => stats.perfectScores >= 1
            },
            {
                id: 'speed_demon',
                name: 'तेज़ दिमाग',
                icon: '⚡',
                description: '10 सेकंड/सवाल से कम समय',
                condition: (stats) => stats.fastCompletions >= 1
            },
            {
                id: 'streak_3',
                name: '3 दिन की लकीर',
                icon: '🔥',
                description: '3 दिन लगातार पढ़ाई',
                condition: (stats) => stats.currentStreak >= 3
            },
            {
                id: 'streak_7',
                name: 'एक हफ्ता',
                icon: '🌟',
                description: '7 दिन लगातार पढ़ाई',
                condition: (stats) => stats.currentStreak >= 7
            },
            {
                id: 'streak_30',
                name: 'महीना पूरा',
                icon: '🏆',
                description: '30 दिन लगातार पढ़ाई',
                condition: (stats) => stats.currentStreak >= 30
            },
            {
                id: 'points_500',
                name: 'पॉइंट्स कलेक्टर',
                icon: '💰',
                description: '500 अंक जमा किए',
                condition: (stats) => stats.totalPoints >= 500
            },
            {
                id: 'points_1000',
                name: 'पॉइंट्स किंग',
                icon: '👑',
                description: '1000 अंक जमा किए',
                condition: (stats) => stats.totalPoints >= 1000
            },
            {
                id: 'physics_master',
                name: 'भौतिकी विशेषज्ञ',
                icon: '⚛️',
                description: 'Physics में 10 Quiz पूरी की',
                condition: (stats) => (stats.subjectQuizzes?.physics || 0) >= 10
            },
            {
                id: 'chemistry_master',
                name: 'रसायन विशेषज्ञ',
                icon: '🧪',
                description: 'Chemistry में 10 Quiz पूरी की',
                condition: (stats) => (stats.subjectQuizzes?.chemistry || 0) >= 10
            },
            {
                id: 'biology_master',
                name: 'जीव विज्ञान विशेषज्ञ',
                icon: '🧬',
                description: 'Biology में 10 Quiz पूरी की',
                condition: (stats) => (stats.subjectQuizzes?.biology || 0) >= 10
            },
            {
                id: 'early_bird',
                name: 'सुबह का तारा',
                icon: '🌅',
                description: 'सुबह 6 बजे से पहले Quiz ली',
                condition: (stats) => stats.earlyMorningQuizzes >= 1
            },
            {
                id: 'night_owl',
                name: 'रात का उल्लू',
                icon: '🦉',
                description: 'रात 10 बजे के बाद Quiz ली',
                condition: (stats) => stats.lateNightQuizzes >= 1
            }
        ];
    }

    loadBadges() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : [];
    }

    saveBadges() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.unlockedBadges));
    }

    checkAndUnlock(stats) {
        const newlyUnlocked = [];

        this.badges.forEach(badge => {
            if (!this.isUnlocked(badge.id) && badge.condition(stats)) {
                this.unlockedBadges.push(badge.id);
                newlyUnlocked.push(badge);
            }
        });

        if (newlyUnlocked.length > 0) {
            this.saveBadges();
            newlyUnlocked.forEach(badge => this.showUnlockModal(badge));
        }

        return newlyUnlocked;
    }

    isUnlocked(badgeId) {
        return this.unlockedBadges.includes(badgeId);
    }

    showUnlockModal(badge) {
        const modal = document.createElement('div');
        modal.className = 'badge-unlock-modal';
        modal.innerHTML = `
            <div class="badge-unlock-content">
                <div class="badge-unlock-icon">${badge.icon}</div>
                <h3 class="badge-unlock-title">बधाई हो! 🎉</h3>
                <p class="badge-unlock-name">${badge.name}</p>
                <p class="badge-unlock-desc">${badge.description}</p>
                <button class="badge-unlock-close" onclick="this.parentElement.parentElement.remove()">ठीक है! 👍</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Auto-close after 5 seconds
        setTimeout(() => modal.remove(), 5000);
    }

    renderBadges() {
        const container = document.getElementById('badgeGrid');
        if (!container) return;

        container.innerHTML = this.badges.map(badge => {
            const unlocked = this.isUnlocked(badge.id);
            return `
                <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="badge-icon">${badge.icon}</div>
                    <div class="badge-name">${badge.name}</div>
                    <div class="badge-description">${badge.description}</div>
                    ${unlocked ? '<div class="badge-status">✅ अनलॉक</div>' : '<div class="badge-status">🔒 लॉक</div>'}
                </div>
            `;
        }).join('');
    }

    getUnlockedCount() {
        return this.unlockedBadges.length;
    }

    getTotalCount() {
        return this.badges.length;
    }
}

// ===== 3. LEADERBOARD MANAGER =====
class LeaderboardManager {
    constructor(userId, userName) {
        this.userId = userId;
        this.userName = userName;
        this.storageKey = 'global_leaderboard';
        this.leaderboard = this.loadLeaderboard();
    }

    loadLeaderboard() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : [];
    }

    saveLeaderboard() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.leaderboard));
    }

    updateUserScore(points) {
        const existingIndex = this.leaderboard.findIndex(entry => entry.userId === this.userId);

        if (existingIndex >= 0) {
            this.leaderboard[existingIndex].points = points;
            this.leaderboard[existingIndex].userName = this.userName;
            this.leaderboard[existingIndex].lastUpdated = Date.now();
        } else {
            this.leaderboard.push({
                userId: this.userId,
                userName: this.userName,
                points: points,
                lastUpdated: Date.now()
            });
        }

        this.leaderboard.sort((a, b) => b.points - a.points);
        this.saveLeaderboard();
    }

    renderLeaderboard() {
        const tbody = document.getElementById('leaderboardBody');
        if (!tbody) return;

        const top10 = this.leaderboard.slice(0, 10);

        tbody.innerHTML = top10.map((entry, index) => {
            const isCurrentUser = entry.userId === this.userId;
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}`;

            return `
                <tr class="${isCurrentUser ? 'current-user' : ''}">
                    <td class="rank-cell">${medal}</td>
                    <td class="name-cell">${isCurrentUser ? entry.userName + ' (आप)' : entry.userName}</td>
                    <td class="points-cell">${entry.points} अंक</td>
                </tr>
            `;
        }).join('');

        // Show user's rank if not in top 10
        const userRank = this.leaderboard.findIndex(entry => entry.userId === this.userId) + 1;
        if (userRank > 10) {
            tbody.innerHTML += `
                <tr class="current-user separator">
                    <td class="rank-cell">${userRank}</td>
                    <td class="name-cell">${this.userName} (आप)</td>
                    <td class="points-cell">${this.leaderboard[userRank - 1].points} अंक</td>
                </tr>
            `;
        }
    }

    getUserRank() {
        return this.leaderboard.findIndex(entry => entry.userId === this.userId) + 1;
    }
}

// ===== 4. STREAK MANAGER =====
class StreakManager {
    constructor(userId) {
        this.userId = userId;
        this.storageKey = `streak_${userId}`;
        this.data = this.loadStreak();
    }

    loadStreak() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: null
        };
    }

    saveStreak() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    updateStreak() {
        const today = this.getDateString();
        const lastDate = this.data.lastActiveDate;

        if (lastDate === today) {
            // Already counted today
            return this.data.currentStreak;
        }

        const yesterday = this.getYesterdayString();

        if (lastDate === yesterday) {
            // Continue streak
            this.data.currentStreak++;
        } else if (lastDate === null || lastDate < yesterday) {
            // Streak broken, start new
            this.data.currentStreak = 1;
        }

        this.data.lastActiveDate = today;

        if (this.data.currentStreak > this.data.longestStreak) {
            this.data.longestStreak = this.data.currentStreak;
        }

        this.saveStreak();
        this.updateUI();
        return this.data.currentStreak;
    }

    getDateString(date = new Date()) {
        return date.toISOString().split('T')[0];
    }

    getYesterdayString() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return this.getDateString(yesterday);
    }

    updateUI() {
        const streakEl = document.querySelector('.streak-count');
        if (streakEl) {
            streakEl.textContent = this.data.currentStreak;
        }
        const detailEl = document.getElementById('currentStreak');
        if (detailEl) {
            detailEl.textContent = `${this.data.currentStreak} दिन`;
        }
        const longestEl = document.getElementById('longestStreak');
        if (longestEl) {
            longestEl.textContent = `${this.data.longestStreak} दिन`;
        }
    }

    getCurrentStreak() {
        return this.data.currentStreak;
    }

    getLongestStreak() {
        return this.data.longestStreak;
    }
}

// ===== 5. DAILY CHALLENGES MANAGER =====
class ChallengeManager {
    constructor(userId) {
        this.userId = userId;
        this.storageKey = `challenges_${userId}`;
        this.data = this.loadChallenges();
        this.challenges = this.defineChallenges();
        this.checkDailyReset();
    }

    defineChallenges() {
        return [
            {
                id: 'daily_3_quizzes',
                name: 'आज 3 Quiz लो',
                icon: '🎯',
                type: 'daily',
                target: 3,
                reward: 100,
                check: (progress) => progress.quizzesToday >= 3
            },
            {
                id: 'daily_score_80',
                name: '80% से ज्यादा स्कोर करो',
                icon: '⭐',
                type: 'daily',
                target: 1,
                reward: 50,
                check: (progress) => progress.highScoresToday >= 1
            },
            {
                id: 'daily_perfect',
                name: 'एक Perfect Score (100%)',
                icon: '💯',
                type: 'daily',
                target: 1,
                reward: 150,
                check: (progress) => progress.perfectScoresToday >= 1
            },
            {
                id: 'weekly_15_quizzes',
                name: 'इस हफ्ते 15 Quiz',
                icon: '📚',
                type: 'weekly',
                target: 15,
                reward: 300,
                check: (progress) => progress.quizzesThisWeek >= 15
            },
            {
                id: 'weekly_all_subjects',
                name: 'सभी विषयों में Quiz लो',
                icon: '🌈',
                type: 'weekly',
                target: 4,
                reward: 200,
                check: (progress) => {
                    const subjects = progress.subjectsThisWeek || new Set();
                    return subjects.size >= 4;
                }
            }
        ];
    }

    loadChallenges() {
        const saved = localStorage.getItem(this.storageKey);
        const defaultData = {
            lastResetDate: this.getDateString(),
            lastWeekReset: this.getWeekString(),
            completed: [],
            progress: {
                quizzesToday: 0,
                highScoresToday: 0,
                perfectScoresToday: 0,
                quizzesThisWeek: 0,
                subjectsThisWeek: new Set()
            }
        };

        const data = saved ? JSON.parse(saved) : defaultData;

        // Convert array back to Set
        if (data.progress.subjectsThisWeek && Array.isArray(data.progress.subjectsThisWeek)) {
            data.progress.subjectsThisWeek = new Set(data.progress.subjectsThisWeek);
        }

        return data;
    }

    saveChallenges() {
        // Convert Set to array for storage
        const dataToSave = {
            ...this.data,
            progress: {
                ...this.data.progress,
                subjectsThisWeek: Array.from(this.data.progress.subjectsThisWeek || [])
            }
        };
        localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
    }

    checkDailyReset() {
        const today = this.getDateString();
        const thisWeek = this.getWeekString();

        // Daily reset
        if (this.data.lastResetDate !== today) {
            this.data.progress.quizzesToday = 0;
            this.data.progress.highScoresToday = 0;
            this.data.progress.perfectScoresToday = 0;
            this.data.completed = this.data.completed.filter(id => !id.startsWith('daily_'));
            this.data.lastResetDate = today;
        }

        // Weekly reset
        if (this.data.lastWeekReset !== thisWeek) {
            this.data.progress.quizzesThisWeek = 0;
            this.data.progress.subjectsThisWeek = new Set();
            this.data.completed = this.data.completed.filter(id => !id.startsWith('weekly_'));
            this.data.lastWeekReset = thisWeek;
        }

        this.saveChallenges();
    }

    updateProgress(quizData) {
        const { score, totalQuestions, subject } = quizData;
        const scorePercent = (score / totalQuestions) * 100;

        // Update progress
        this.data.progress.quizzesToday++;
        this.data.progress.quizzesThisWeek++;

        if (scorePercent >= 80) {
            this.data.progress.highScoresToday++;
        }

        if (scorePercent === 100) {
            this.data.progress.perfectScoresToday++;
        }

        if (subject) {
            if (!this.data.progress.subjectsThisWeek) {
                this.data.progress.subjectsThisWeek = new Set();
            }
            this.data.progress.subjectsThisWeek.add(subject);
        }

        // Check for completions
        const newCompletions = [];
        this.challenges.forEach(challenge => {
            if (!this.isCompleted(challenge.id) && challenge.check(this.data.progress)) {
                this.data.completed.push(challenge.id);
                newCompletions.push(challenge);
            }
        });

        this.saveChallenges();
        this.renderChallenges();

        // Award bonus points and show feedback
        return newCompletions;
    }

    isCompleted(challengeId) {
        return this.data.completed.includes(challengeId);
    }

    getDateString(date = new Date()) {
        return date.toISOString().split('T')[0];
    }

    getWeekString(date = new Date()) {
        const year = date.getFullYear();
        const week = this.getWeekNumber(date);
        return `${year}-W${week}`;
    }

    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    renderChallenges() {
        const container = document.getElementById('challengesContainer');
        if (!container) return;

        container.innerHTML = this.challenges.map(challenge => {
            const completed = this.isCompleted(challenge.id);
            const progress = this.getChallengeProgress(challenge);
            const progressPercent = Math.min((progress / challenge.target) * 100, 100);

            return `
                <div class="challenge-card ${completed ? 'completed' : ''}">
                    <div class="challenge-header">
                        <div class="challenge-icon">${challenge.icon}</div>
                        <div class="challenge-info">
                            <div class="challenge-name">${challenge.name}</div>
                            <div class="challenge-type">${challenge.type === 'daily' ? '📅 रोज़ाना' : '📆 साप्ताहिक'}</div>
                        </div>
                        <div class="challenge-reward">+${challenge.reward} अंक</div>
                    </div>
                    <div class="challenge-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="progress-text">${progress}/${challenge.target}</div>
                    </div>
                    ${completed ? '<div class="challenge-status">✅ पूरा हुआ!</div>' : ''}
                </div>
            `;
        }).join('');
    }

    getChallengeProgress(challenge) {
        const progress = this.data.progress;

        switch(challenge.id) {
            case 'daily_3_quizzes':
                return progress.quizzesToday;
            case 'daily_score_80':
                return progress.highScoresToday;
            case 'daily_perfect':
                return progress.perfectScoresToday;
            case 'weekly_15_quizzes':
                return progress.quizzesThisWeek;
            case 'weekly_all_subjects':
                return (progress.subjectsThisWeek || new Set()).size;
            default:
                return 0;
        }
    }
}

// ===== 6. SOUND MANAGER =====
class SoundManager {
    constructor() {
        this.enabled = this.loadSoundPreference();
        this.audioContext = null;
    }

    loadSoundPreference() {
        const saved = localStorage.getItem('soundEnabled');
        return saved === null ? true : saved === 'true';
    }

    saveSoundPreference() {
        localStorage.setItem('soundEnabled', this.enabled);
    }

    toggleSound() {
        this.enabled = !this.enabled;
        this.saveSoundPreference();
        this.updateUI();
        return this.enabled;
    }

    updateUI() {
        const toggleBtn = document.getElementById('soundToggle');
        if (toggleBtn) {
            toggleBtn.textContent = this.enabled ? '🔊' : '🔇';
            toggleBtn.title = this.enabled ? 'Sound ON' : 'Sound OFF';
        }
    }

    getAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    }

    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled) return;

        try {
            const ctx = this.getAudioContext();

            // Resume AudioContext if suspended (browser autoplay policy)
            if (ctx.state === 'suspended') {
                ctx.resume().then(() => {
                    console.log('🔊 AudioContext resumed');
                    this.playToneInternal(ctx, frequency, duration, type);
                }).catch(e => console.warn('Failed to resume AudioContext:', e));
            } else {
                this.playToneInternal(ctx, frequency, duration, type);
            }
        } catch (e) {
            console.warn('Audio playback failed:', e);
        }
    }

    playToneInternal(ctx, frequency, duration, type) {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    }

    playCorrect() {
        // Pleasant ascending beep (C to E)
        this.playTone(523.25, 0.1); // C5
        setTimeout(() => this.playTone(659.25, 0.15), 100); // E5
    }

    playWrong() {
        // Short buzzer
        this.playTone(200, 0.2, 'sawtooth');
    }

    playSuccess() {
        // Victory ding (ascending notes)
        this.playTone(523.25, 0.15); // C5
        setTimeout(() => this.playTone(659.25, 0.15), 150); // E5
        setTimeout(() => this.playTone(783.99, 0.3), 300); // G5
    }

    playBadgeUnlock() {
        // Special celebration sound
        this.playTone(783.99, 0.2); // G5
        setTimeout(() => this.playTone(1046.50, 0.3), 200); // C6
    }
}

// ===== GAMIFICATION COORDINATOR =====
class GamificationSystem {
    constructor() {
        this.userManager = new UserManager();
        this.pointsManager = new PointsManager(this.userManager.userId);
        this.badgeManager = new BadgeManager(this.userManager.userId);
        this.streakManager = new StreakManager(this.userManager.userId);
        this.leaderboardManager = new LeaderboardManager(this.userManager.userId, this.userManager.userName);
        this.challengeManager = new ChallengeManager(this.userManager.userId);
        this.soundManager = new SoundManager();
    }

    initialize() {
        // Render all UI elements
        this.pointsManager.updateUI();
        this.badgeManager.renderBadges();
        this.streakManager.updateUI();
        this.leaderboardManager.renderLeaderboard();
        this.challengeManager.renderChallenges();
        this.soundManager.updateUI();

        // Update streak on load
        this.streakManager.updateStreak();
    }

    onCorrectAnswer(element) {
        // Award points
        this.pointsManager.awardCorrectAnswer();

        // Play sound
        this.soundManager.playCorrect();

        // Add animation
        if (element) {
            element.classList.add('answer-correct-animation');
            setTimeout(() => element.classList.remove('answer-correct-animation'), 600);
        }
    }

    onWrongAnswer(element) {
        // Play sound
        this.soundManager.playWrong();

        // Add animation
        if (element) {
            element.classList.add('answer-wrong-animation');
            setTimeout(() => element.classList.remove('answer-wrong-animation'), 600);
        }
    }

    onQuizComplete(quizData) {
        const { score, totalQuestions, subject, timeTaken } = quizData;

        // Award completion points
        this.pointsManager.awardQuizCompletion(score, totalQuestions);

        // Update streak
        this.streakManager.updateStreak();

        // Update challenges
        const completedChallenges = this.challengeManager.updateProgress(quizData);

        // Award challenge bonuses
        completedChallenges.forEach(challenge => {
            this.pointsManager.awardPoints(challenge.reward, `Challenge: ${challenge.name}`);
        });

        // Get stats for badge checking
        const stats = this.getStats(quizData);

        // Check badges
        const newBadges = this.badgeManager.checkAndUnlock(stats);

        // Play sounds
        if (newBadges.length > 0) {
            setTimeout(() => this.soundManager.playBadgeUnlock(), 500);
        }
        this.soundManager.playSuccess();

        // Update leaderboard
        this.leaderboardManager.updateUserScore(this.pointsManager.getPoints());

        // Render everything
        this.badgeManager.renderBadges();
        this.leaderboardManager.renderLeaderboard();

        // Add celebration animation
        this.addCelebrationAnimation();
    }

    getStats(quizData) {
        const { score, totalQuestions, subject, timeTaken } = quizData;

        // Load stats from localStorage
        const statsKey = `stats_${this.userManager.userId}`;
        const saved = localStorage.getItem(statsKey);
        const stats = saved ? JSON.parse(saved) : {
            quizzesCompleted: 0,
            perfectScores: 0,
            fastCompletions: 0,
            totalPoints: 0,
            currentStreak: 0,
            subjectQuizzes: {},
            earlyMorningQuizzes: 0,
            lateNightQuizzes: 0
        };

        // Update stats
        stats.quizzesCompleted++;
        stats.totalPoints = this.pointsManager.getPoints();
        stats.currentStreak = this.streakManager.getCurrentStreak();

        if (score === totalQuestions) {
            stats.perfectScores++;
        }

        if (timeTaken && timeTaken / totalQuestions < 10) {
            stats.fastCompletions++;
        }

        if (subject) {
            stats.subjectQuizzes[subject] = (stats.subjectQuizzes[subject] || 0) + 1;
        }

        // Check time of day
        const hour = new Date().getHours();
        if (hour < 6) {
            stats.earlyMorningQuizzes++;
        } else if (hour >= 22) {
            stats.lateNightQuizzes++;
        }

        // Save updated stats
        localStorage.setItem(statsKey, JSON.stringify(stats));

        return stats;
    }

    addCelebrationAnimation() {
        const quizContainer = document.querySelector('.quiz-interface');
        if (quizContainer) {
            quizContainer.classList.add('celebration-animation');
            setTimeout(() => quizContainer.classList.remove('celebration-animation'), 1000);
        }
    }
}

// ===== GLOBAL INSTANCE =====
// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    const gamification = new GamificationSystem();
    gamification.initialize();

    // Export to window for quiz integration
    window.gamification = gamification;

    // Setup sound toggle button
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            gamification.soundManager.toggleSound();
        });
    }

    console.log('🎮 Gamification System Loaded! Points, Badges, Leaderboard, Streaks, Challenges ready! 🚀');
});
