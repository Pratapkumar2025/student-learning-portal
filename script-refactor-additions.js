/*
 * 🔥 HAMAR PADHAI - SENIOR FRONTEND REFACTORING 🔥
 * JavaScript Enhancements: Immersive Quiz Mode, Scroll Animations, Missing Functions
 * Add these functions to your existing script.js
 */

// ========================================
// 1. IMMERSIVE QUIZ MODE
// ========================================

/**
 * Enter Quiz Mode - Makes quiz fullscreen and immersive
 */
function enterQuizMode() {
    document.body.classList.add('quiz-mode-active');

    // Add exit button if it doesn't exist
    if (!document.querySelector('.quiz-exit-btn')) {
        const exitBtn = document.createElement('button');
        exitBtn.className = 'quiz-exit-btn';
        exitBtn.innerHTML = '✕';
        exitBtn.setAttribute('aria-label', 'क्विज़ छोड़ें');
        exitBtn.onclick = exitQuizMode;
        document.body.appendChild(exitBtn);
    }

    // Scroll to top of quiz
    document.getElementById('quiz').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    console.log('🎯 Quiz Mode Activated - Immersive Experience!');
}

/**
 * Exit Quiz Mode - Returns to normal layout
 */
function exitQuizMode() {
    if (confirm('क्या आप क्विज छोड़ना चाहते हैं?')) {
        document.body.classList.remove('quiz-mode-active');
        document.body.style.overflow = '';

        // Reset quiz
        resetQuiz();

        console.log('🏠 Exited Quiz Mode');
    }
}

/**
 * Modified startSubjectQuiz to include immersive mode
 * REPLACE your existing startSubjectQuiz function with this
 */
function startSubjectQuiz() {
    const count = quizState.questionCount;
    const subject = quizState.selectedSubject;
    const allQuestions = subjectQuestions[subject] || [];

    if (allQuestions.length === 0) {
        alert('इस विषय के लिए प्रश्न जल्द ही आ रहे हैं!');
        return;
    }

    // Select questions with mixed difficulty
    quizState.questions = selectMixedDifficultyQuestions(allQuestions, count);
    quizState.answers = new Array(quizState.questions.length).fill(null);
    quizState.currentQuestionIndex = 0;

    // Reset score
    quizState.score = { correct: 0, wrong: 0, skipped: 0 };

    // Hide question count, show quiz interface
    document.getElementById('questionCountSelection').classList.add('hidden');
    document.getElementById('quizInterface').classList.remove('hidden');

    // ⭐ ENTER IMMERSIVE MODE
    enterQuizMode();

    // Load first question
    loadQuestion();

    // Start timer
    quizState.startTime = Date.now();
    startTimer();

    console.log(`🚀 Quiz Started: ${count} questions from ${subject}`);
}

/**
 * Modified nextQuestion with better validation
 * REPLACE your existing nextQuestion function with this
 */
function nextQuestion() {
    const currentAnswer = quizState.answers[quizState.currentQuestionIndex];

    // Check if user has selected an answer
    if (currentAnswer === null || currentAnswer === undefined) {
        alert('अरे भाई! पहले जवाब तऽ दे दऽ, या फिर \'छोड़ें\' बटन दबावा!');
        return;
    }

    // Move to next question
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
        quizState.currentQuestionIndex++;
        loadQuestion();
    } else {
        // Quiz complete
        finishQuiz();
    }
}

/**
 * Modified finishQuiz to exit immersive mode
 * REPLACE your existing finishQuiz function with this
 */
function finishQuiz() {
    stopTimer();

    // Calculate results
    const totalQuestions = quizState.questions.length;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    quizState.questions.forEach((q, index) => {
        const userAnswer = quizState.answers[index];
        if (userAnswer === null || userAnswer === undefined) {
            skipped++;
        } else if (userAnswer === q.correct) {
            correct++;
        } else {
            wrong++;
        }
    });

    quizState.score = { correct, wrong, skipped };

    // Calculate percentage
    const percentage = ((correct / totalQuestions) * 100).toFixed(1);

    // Update results UI
    document.getElementById('correctAnswers').textContent = correct;
    document.getElementById('wrongAnswers').textContent = wrong;
    document.getElementById('skippedQuestions').textContent = skipped;
    document.getElementById('scorePercentage').textContent = percentage + '%';

    // Calculate time spent
    const timeSpent = Math.floor((Date.now() - quizState.startTime) / 1000);
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    document.getElementById('timeTaken').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Show appropriate message
    let message = '';
    if (percentage >= 80) {
        message = high_score_messages[Math.floor(Math.random() * high_score_messages.length)];
    } else if (percentage >= 50) {
        message = 'बढ़िया! थोड़ा और मेहनत करऽ! 💪';
    } else {
        message = low_score_messages[Math.floor(Math.random() * low_score_messages.length)];
    }
    document.getElementById('resultMessage').textContent = message;

    // Hide quiz interface, show results
    document.getElementById('quizInterface').classList.add('hidden');
    document.getElementById('quizResults').classList.remove('hidden');

    // ⭐ EXIT IMMERSIVE MODE
    document.body.classList.remove('quiz-mode-active');
    document.body.style.overflow = '';

    console.log('✅ Quiz Completed!', quizState.score);
}

// ========================================
// 2. SCROLL REVEAL ANIMATIONS
// ========================================

/**
 * Intersection Observer for scroll animations
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if (revealElements.length === 0) {
        console.log('⚠️ No .reveal elements found. Add class="reveal" to elements you want to animate.');
        return;
    }

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionally unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });

    console.log(`📜 Scroll Reveal initialized for ${revealElements.length} elements`);
}

/**
 * Add 'scrolled' class to header on scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    console.log('📍 Header scroll effect initialized');
}

// ========================================
// 3. VIEW MORE/LESS FUNCTIONALITY
// ========================================

/**
 * Toggle View More/Less for Stories
 */
function toggleStories() {
    const storiesGrid = document.querySelector('.stories-grid');
    const btn = document.getElementById('viewMoreStoriesBtn');

    if (!storiesGrid || !btn) return;

    const isExpanded = storiesGrid.classList.contains('expanded');

    if (isExpanded) {
        storiesGrid.classList.remove('expanded');
        btn.textContent = '📖 और कहानियाँ देखें';
        // Scroll to stories section
        document.getElementById('hindi-stories').scrollIntoView({ behavior: 'smooth' });
    } else {
        storiesGrid.classList.add('expanded');
        btn.textContent = '🔼 कम दिखाएं';
    }
}

/**
 * Toggle View More/Less for Puzzles
 */
function togglePuzzles() {
    const puzzlesGrid = document.querySelector('.puzzles-grid');
    const btn = document.getElementById('viewMorePuzzlesBtn');

    if (!puzzlesGrid || !btn) return;

    const isExpanded = puzzlesGrid.classList.contains('expanded');

    if (isExpanded) {
        puzzlesGrid.classList.remove('expanded');
        btn.textContent = '🤔 और पहेलियाँ देखें';
        // Scroll to puzzles section
        document.getElementById('puzzles').scrollIntoView({ behavior: 'smooth' });
    } else {
        puzzlesGrid.classList.add('expanded');
        btn.textContent = '🔼 कम दिखाएं';
    }
}

// ========================================
// 4. MISSING FUNCTIONS FROM CLAUDE.MD
// ========================================

/**
 * Show specific gallery category
 */
function showGalleryCategory(category) {
    // Hide all categories
    document.querySelectorAll('.personality-category').forEach(cat => {
        cat.classList.add('hidden');
    });

    // Show selected category
    const selectedCategory = document.getElementById(`category-${category}`);
    if (selectedCategory) {
        selectedCategory.classList.remove('hidden');
    }

    // Update tab buttons
    document.querySelectorAll('.gallery-tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.querySelector(`[onclick="showGalleryCategory('${category}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    console.log(`📂 Gallery Category: ${category}`);
}

/**
 * Open story in modal/expanded view
 */
function openStory(storyId) {
    const story = document.getElementById(`story-${storyId}`);
    if (!story) {
        console.error('Story not found:', storyId);
        return;
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'story-modal';
    modal.innerHTML = `
        <div class="story-modal-content">
            <button class="story-modal-close" onclick="closeStoryModal()">✕</button>
            <div class="story-full-text">
                ${story.querySelector('.story-full-text')?.innerHTML || story.innerHTML}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Add styles if not exist
    if (!document.getElementById('story-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'story-modal-styles';
        style.textContent = `
            .story-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 1rem;
                backdrop-filter: blur(5px);
            }
            .story-modal-content {
                background: var(--bg-card);
                border-radius: var(--radius-lg);
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                padding: 2rem;
                position: relative;
                box-shadow: var(--shadow-xl);
            }
            .story-modal-close {
                position: sticky;
                top: 0;
                right: 0;
                float: right;
                width: 40px;
                height: 40px;
                background: var(--error);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                margin-bottom: 1rem;
            }
            .story-full-text {
                line-height: 1.8;
                font-size: 1.1rem;
            }
        `;
        document.head.appendChild(style);
    }

    console.log(`📖 Opened Story: ${storyId}`);
}

/**
 * Close story modal
 */
function closeStoryModal() {
    const modal = document.querySelector('.story-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

/**
 * Toggle puzzle answer visibility
 */
function toggleAnswer(puzzleId) {
    const answer = document.getElementById(`answer-${puzzleId}`);
    const btn = document.querySelector(`[onclick="toggleAnswer(${puzzleId})"]`);

    if (!answer || !btn) return;

    const isHidden = answer.classList.contains('hidden');

    if (isHidden) {
        answer.classList.remove('hidden');
        btn.textContent = '🙈 जवाब छुपाएं';
    } else {
        answer.classList.add('hidden');
        btn.textContent = '👀 जवाब देखें';
    }
}

// ========================================
// 5. INITIALIZATION
// ========================================

/**
 * Initialize all enhancements when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Hamar Padhai Enhancements...');

    // Initialize scroll animations
    initScrollReveal();

    // Initialize header scroll effect
    initHeaderScroll();

    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // ESC to exit quiz mode
        if (e.key === 'Escape' && document.body.classList.contains('quiz-mode-active')) {
            exitQuizMode();
        }
    });

    console.log('✅ All enhancements initialized successfully!');
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        enterQuizMode,
        exitQuizMode,
        toggleStories,
        togglePuzzles,
        showGalleryCategory,
        openStory,
        toggleAnswer
    };
}
