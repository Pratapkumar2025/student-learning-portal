/*
 * Complete Quiz Functions - Timer, Question Loading, Navigation
 * Works with quiz-system-new.js
 */

// ===== TIMER FUNCTIONS =====
function startTimer() {
    quizState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - quizState.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timerEl = document.getElementById('timerDisplay');
        if (timerEl) {
            timerEl.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
        }
    }, 1000);
}

function stopTimer() {
    if (quizState.timerInterval) {
        clearInterval(quizState.timerInterval);
        quizState.timerInterval = null;
    }
}

// ===== QUESTION LOADING =====
function loadQuestion() {
    const question = quizState.questions[quizState.currentQuestionIndex];
    if (!question) return;

    // Update progress bar
    const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }

    // Update question counter
    const currentQuestionEl = document.getElementById('currentQuestion');
    if (currentQuestionEl) {
        currentQuestionEl.textContent = quizState.currentQuestionIndex + 1;
    }

    // Update question text
    const questionTextEl = document.getElementById('questionText');
    if (questionTextEl) {
        questionTextEl.textContent = question.question;
    }

    // Show difficulty badge
    const difficultyBadge = question.difficulty === 'easy' ? '⚡ आसान' :
                           question.difficulty === 'medium' ? '📚 मध्यम' :
                           '🔥 कठिन';
    const difficultyEl = document.getElementById('difficultyBadge');
    if (difficultyEl) {
        difficultyEl.textContent = difficultyBadge;
    }

    // Create option buttons
    const optionsContainer = document.getElementById('optionsContainer');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';

            const letter = String.fromCharCode(65 + index);
            button.innerHTML = '<span class="option-letter">' + letter + '</span><span class="option-text">' + option + '</span>';

            button.onclick = function() { selectOption(index); };

            // Show previous selection if exists
            if (quizState.answers[quizState.currentQuestionIndex] === index) {
                button.classList.add('selected');
            }

            optionsContainer.appendChild(button);
        });
    }

    // Hide explanation initially
    const explanationBox = document.getElementById('explanationBox');
    if (explanationBox) {
        explanationBox.classList.add('hidden');
    }

    // Update navigation button states
    updateButtonStates();
}

function selectOption(optionIndex) {
    const question = quizState.questions[quizState.currentQuestionIndex];
    if (!question) return;

    // Save answer
    quizState.answers[quizState.currentQuestionIndex] = optionIndex;

    // Update UI - show correct/wrong
    const options = document.querySelectorAll('.option-btn');
    options.forEach((btn, idx) => {
        btn.classList.remove('selected', 'correct', 'wrong');
        btn.disabled = true;

        if (idx === optionIndex) {
            if (idx === question.correct) {
                btn.classList.add('correct');
                // Gamification: Correct answer
                console.log('✅ Correct answer! Gamification:', window.gamification ? 'Available' : 'NOT AVAILABLE');
                if (window.gamification) {
                    window.gamification.onCorrectAnswer(btn);
                }
            } else {
                btn.classList.add('wrong');
                // Gamification: Wrong answer
                console.log('❌ Wrong answer! Gamification:', window.gamification ? 'Available' : 'NOT AVAILABLE');
                if (window.gamification) {
                    window.gamification.onWrongAnswer(btn);
                }
            }
        }

        // Always show correct answer
        if (idx === question.correct) {
            btn.classList.add('correct');
        }
    });

    // Show explanation
    const explanationText = document.getElementById('explanationText');
    const explanationBox = document.getElementById('explanationBox');
    if (explanationText && explanationBox) {
        explanationText.textContent = question.explanation;
        explanationBox.classList.remove('hidden');
    }

    // Update buttons
    updateButtonStates();
}

function updateButtonStates() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Disable previous on first question
    if (prevBtn) {
        prevBtn.disabled = quizState.currentQuestionIndex === 0;
    }

    // Enable next button if answer is selected
    const hasAnswer = quizState.answers[quizState.currentQuestionIndex] !== null;
    if (nextBtn) {
        nextBtn.disabled = !hasAnswer;
    }

    // Show submit on last question, next otherwise
    const isLastQuestion = quizState.currentQuestionIndex === quizState.questions.length - 1;

    if (nextBtn && submitBtn) {
        if (isLastQuestion) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
            submitBtn.disabled = !hasAnswer;
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }
}

function nextQuestion() {
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
        quizState.currentQuestionIndex++;
        loadQuestion();
    }
}

function previousQuestion() {
    if (quizState.currentQuestionIndex > 0) {
        quizState.currentQuestionIndex--;
        loadQuestion();
    }
}

function submitQuiz() {
    stopTimer();

    // Calculate results
    let correct = 0;
    quizState.questions.forEach((q, i) => {
        if (quizState.answers[i] === q.correct) {
            correct++;
        }
    });

    const totalQuestions = quizState.questions.length;
    const scorePercent = Math.round((correct / totalQuestions) * 100);
    const timeTaken = Math.floor((Date.now() - quizState.startTime) / 1000);

    // Update score
    quizState.score.correct = correct;
    quizState.score.wrong = totalQuestions - correct;

    // Gamification: Quiz complete
    if (window.gamification) {
        window.gamification.onQuizComplete({
            score: correct,
            totalQuestions: totalQuestions,
            subject: quizState.selectedSubject,
            timeTaken: timeTaken
        });
    }

    // Show results
    showResults(correct, totalQuestions, scorePercent, timeTaken);
}

function showResults(correct, total, scorePercent, timeTaken) {
    // Hide quiz, show results
    document.getElementById('quizInterface').classList.add('hidden');

    const resultsSection = document.getElementById('quizResults');
    if (!resultsSection) {
        alert('Score: ' + scorePercent + '% | Correct: ' + correct + '/' + total);
        goHome();
        return;
    }

    resultsSection.classList.remove('hidden');

    // Update score value and percentage (matching your HTML IDs)
    const scoreValue = document.getElementById('scoreValue');
    if (scoreValue) {
        scoreValue.textContent = correct;
    }

    const totalScore = document.getElementById('totalScore');
    if (totalScore) {
        totalScore.textContent = total;
    }

    const scorePercentage = document.getElementById('scorePercentage');
    if (scorePercentage) {
        scorePercentage.textContent = scorePercent + '%';
    }

    // Update stats
    const correctAnswers = document.getElementById('correctAnswers');
    if (correctAnswers) {
        correctAnswers.textContent = correct;
    }

    const wrongAnswers = document.getElementById('wrongAnswers');
    if (wrongAnswers) {
        wrongAnswers.textContent = total - correct;
    }

    // Update results title based on score
    const resultsTitle = document.querySelector('.results-title');
    if (resultsTitle) {
        if (scorePercent === 100) {
            resultsTitle.textContent = 'जिया हो बिहार के लाला! 💯';
        } else if (scorePercent >= 80) {
            resultsTitle.textContent = 'आज तऽ धुआँ उड़ा देलऽ! 🎉';
        } else if (scorePercent >= 60) {
            resultsTitle.textContent = 'बढ़िया! अब और जोर लगा! 💪';
        } else {
            resultsTitle.textContent = 'तनी और मेहनत करऽ! 📚';
        }
    }

    // Update icon
    const resultsIcon = document.querySelector('.results-icon');
    if (resultsIcon) {
        resultsIcon.textContent = scorePercent >= 80 ? '🏆' : scorePercent >= 60 ? '⭐' : '💪';
    }
}

function goHome() {
    // Reset everything and go back to subject selection
    stopTimer();

    const quizInterface = document.getElementById('quizInterface');
    const quizResults = document.getElementById('quizResults');
    const questionCountSelection = document.getElementById('questionCountSelection');
    const subjectSelection = document.getElementById('subjectSelection');

    if (quizInterface) quizInterface.classList.add('hidden');
    if (quizResults) quizResults.classList.add('hidden');
    if (questionCountSelection) questionCountSelection.classList.add('hidden');
    if (subjectSelection) subjectSelection.classList.remove('hidden');

    quizState = {
        selectedSubject: null,
        questionCount: 10,
        currentQuestionIndex: 0,
        questions: [],
        answers: [],
        startTime: null,
        timerInterval: null,
        score: { correct: 0, wrong: 0, skipped: 0 }
    };
}

// ========================================
// SKIP QUESTION FUNCTION - Bug Fix Dec 2025
// ========================================

// Skip Question Function
function skipQuestion() {
    console.log('Skipping question:', quizState.currentQuestionIndex);

    // Mark current answer as skipped (null)
    if (typeof quizState !== 'undefined' && quizState.answers) {
        quizState.answers[quizState.currentQuestionIndex] = null;
    }

    // Move to next question
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
        quizState.currentQuestionIndex++;
        loadQuestion();
    } else {
        // Last question - show submit button
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (nextBtn) nextBtn.classList.add('hidden');
        if (submitBtn) {
            submitBtn.classList.remove('hidden');
            submitBtn.disabled = false;
        }
    }
}

console.log('✅ Complete Quiz Functions Loaded! Ready to play!');
