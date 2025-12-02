/*
 * 🔥 HAMAR PADHAI - TABBED NAVIGATION SYSTEM 🔥
 * Revolutionary: Click navigation = Show ONLY that section
 * ZERO vertical scrolling required!
 */

// ========================================
// 1. SECTION NAVIGATION SYSTEM
// ========================================

/**
 * Show a specific section, hide all others
 */
function showSection(sectionId) {
    console.log(`📂 Switching to section: ${sectionId}`);

    // Hide ALL sections
    const allSections = document.querySelectorAll('section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });

    // Show ONLY the requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');

        // Scroll to top of content area
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.error(`❌ Section not found: ${sectionId}`);
    }

    // Update active navigation link
    updateActiveNav(sectionId);

    // Close mobile menu if open
    closeMobileMenu();

    // Store current section in localStorage
    localStorage.setItem('currentSection', sectionId);
}

/**
 * Update active state on navigation links
 */
function updateActiveNav(sectionId) {
    // Remove active from all nav links
    const allLinks = document.querySelectorAll('.nav-link');
    allLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add active to current link
    const currentLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
}

/**
 * Initialize navigation links
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Get section ID from href (#quiz → quiz)
            const href = link.getAttribute('href');
            const sectionId = href.replace('#', '');

            // Show that section
            showSection(sectionId);
        });
    });

    console.log(`✅ Navigation initialized for ${navLinks.length} links`);
}

// ========================================
// 2. MOBILE HAMBURGER MENU
// ========================================

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');

    if (!navMenu || !navToggle) return;

    navMenu.classList.toggle('open');
    navToggle.classList.toggle('active');

    console.log(`📱 Mobile menu: ${navMenu.classList.contains('open') ? 'Open' : 'Closed'}`);
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');

    if (navMenu) navMenu.classList.remove('open');
    if (navToggle) navToggle.classList.remove('active');
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');

    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
        console.log('📱 Mobile menu initialized');
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');

        if (!navMenu || !navToggle) return;

        const isClickInsideMenu = navMenu.contains(e.target);
        const isClickOnToggle = navToggle.contains(e.target);

        if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });
}

// ========================================
// 3. QUICK STATS NAVIGATION
// ========================================

/**
 * Make stat cards clickable
 */
function initQuickStats() {
    const statCards = [
        { card: 'stat-quiz', section: 'quiz' },
        { card: 'stat-study', section: 'study' },
        { card: 'stat-gallery', section: 'gallery' },
        { card: 'stat-stories', section: 'hindi-stories' }
    ];

    statCards.forEach(({ card, section }) => {
        const element = document.getElementById(card);
        if (element) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', () => {
                showSection(section);
            });
        }
    });

    console.log('✅ Quick stats navigation initialized');
}

// ========================================
// 4. RESTORE LAST VIEWED SECTION
// ========================================

/**
 * Restore the last section user was viewing
 */
function restoreLastSection() {
    const lastSection = localStorage.getItem('currentSection');

    if (lastSection) {
        showSection(lastSection);
        console.log(`🔄 Restored last section: ${lastSection}`);
    } else {
        // Default: Show home
        showSection('home');
        console.log('🏠 Showing default home section');
    }
}

// ========================================
// 5. KEYBOARD NAVIGATION
// ========================================

/**
 * Add keyboard shortcuts
 */
function initKeyboardNav() {
    const shortcuts = {
        '1': 'home',
        '2': 'quiz',
        '3': 'study',
        '4': 'gallery',
        '5': 'hindi-stories',
        '6': 'puzzles',
        'h': 'home',
        'q': 'quiz',
        's': 'study',
        'Escape': 'home' // ESC = go home
    };

    document.addEventListener('keydown', (e) => {
        // Don't trigger if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        const sectionId = shortcuts[e.key];
        if (sectionId) {
            showSection(sectionId);
            console.log(`⌨️ Keyboard shortcut: ${e.key} → ${sectionId}`);
        }
    });

    console.log('⌨️ Keyboard navigation enabled (1-6, H, Q, S, ESC)');
}

// ========================================
// 6. URL HASH NAVIGATION
// ========================================

/**
 * Support URL hash navigation (#quiz, #study, etc.)
 */
function initHashNavigation() {
    // Handle initial hash
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
        showSection(hash);
    }

    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.replace('#', '');
        if (newHash && document.getElementById(newHash)) {
            showSection(newHash);
        }
    });

    console.log('🔗 URL hash navigation enabled');
}

// ========================================
// 7. SCROLL DEPTH TRACKING
// ========================================

/**
 * Track scroll depth (should be minimal!)
 */
function trackScrollDepth() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    const scrollsRequired = Math.ceil(docHeight / window.innerHeight);

    return {
        scrollTop,
        docHeight,
        scrollPercent: scrollPercent.toFixed(1),
        scrollsRequired: Math.max(0, scrollsRequired)
    };
}

/**
 * Show scroll stats (for testing)
 */
function showScrollStats() {
    const depth = trackScrollDepth();

    let statsDiv = document.getElementById('scrollStatsOverlay');

    if (!statsDiv) {
        statsDiv = document.createElement('div');
        statsDiv.id = 'scrollStatsOverlay';
        statsDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(255, 107, 53, 0.95);
            color: white;
            padding: 12px 16px;
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 998;
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(statsDiv);
    }

    statsDiv.innerHTML = `
        <div style="margin-bottom: 4px;">📊 Scroll: ${depth.scrollPercent}%</div>
        <div>🎯 Scrolls: ${depth.scrollsRequired} (Target: 0-1)</div>
    `;
}

// ========================================
// 8. BREADCRUMB NAVIGATION
// ========================================

/**
 * Show current section in breadcrumb
 */
function updateBreadcrumb(sectionId) {
    const sectionNames = {
        'home': '🏠 घर (Home)',
        'quiz': '📚 क्विज़ (Quiz)',
        'study': '📖 पढ़ाई (Study)',
        'gallery': '🌟 गैलरी (Gallery)',
        'hindi-stories': '📖 कहानियाँ (Stories)',
        'puzzles': '🤔 पहेलियाँ (Puzzles)',
        'leaderboard': '🏆 लीडरबोर्ड (Leaderboard)',
        'progress': '📊 प्रगति (Progress)'
    };

    const breadcrumbText = sectionNames[sectionId] || sectionId;

    // Create or update breadcrumb
    let breadcrumb = document.getElementById('breadcrumb');

    if (!breadcrumb) {
        breadcrumb = document.createElement('div');
        breadcrumb.id = 'breadcrumb';
        breadcrumb.style.cssText = `
            position: fixed;
            top: 70px;
            left: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            color: #FF6B35;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 999;
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(breadcrumb);
    }

    breadcrumb.textContent = breadcrumbText;
}

// ========================================
// 9. SECTION LOADING ANIMATION
// ========================================

/**
 * Show loading state when switching sections
 */
function showLoadingState(show = true) {
    let loader = document.getElementById('sectionLoader');

    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'sectionLoader';
            loader.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 255, 255, 0.95);
                padding: 20px 40px;
                border-radius: 12px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.2);
                z-index: 9998;
                backdrop-filter: blur(10px);
            `;
            loader.innerHTML = `
                <div style="text-align: center;">
                    <div class="spinner" style="margin: 0 auto 10px;"></div>
                    <div style="font-weight: 600; color: #FF6B35;">तनी साबर करीं...</div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'block';
    } else {
        if (loader) {
            loader.style.display = 'none';
        }
    }
}

// ========================================
// 10. INITIALIZATION
// ========================================

/**
 * Initialize tabbed navigation system
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Tabbed Navigation System...');

    // Core navigation
    initNavigation();
    initMobileMenu();
    initHashNavigation();

    // Enhanced features
    initQuickStats();
    initKeyboardNav();

    // Restore last section or show home
    setTimeout(() => {
        restoreLastSection();
    }, 100);

    // Track scroll depth (for testing)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.addEventListener('scroll', () => {
            showScrollStats();
        });
        showScrollStats();
    }

    // Log success
    setTimeout(() => {
        const depth = trackScrollDepth();
        console.log(`✅ Tabbed Navigation Active!`);
        console.log(`📊 Current scrolls required: ${depth.scrollsRequired}`);
        console.log(`🎯 Expected: 0-1 scroll per section`);
        console.log(`⌨️ Keyboard shortcuts: 1-6, H, Q, S, ESC`);
    }, 500);
});

// ========================================
// 11. EXPORT FOR GLOBAL ACCESS
// ========================================

window.HamarPadhaiNav = {
    showSection,
    toggleMobileMenu,
    closeMobileMenu,
    trackScrollDepth,
    showScrollStats,
    updateBreadcrumb
};

console.log('📦 HamarPadhaiNav functions available globally');
