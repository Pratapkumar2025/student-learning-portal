/*
 * 🔥 HAMAR PADHAI - ULTRA COMPACT SCRIPTS 🔥
 * Reduces scroll from 20+ to just 5!
 * Production-Ready | Vanilla JavaScript
 */

// ========================================
// 1. COLLAPSIBLE SECTIONS
// ========================================

/**
 * Initialize all collapsible sections as collapsed by default
 */
function initCollapsibleSections() {
    const collapsibles = document.querySelectorAll('.collapsible-section');

    collapsibles.forEach((section, index) => {
        const header = section.querySelector('.collapsible-header');
        const icon = section.querySelector('.collapsible-icon');

        // First 2 sections expanded by default, rest collapsed
        if (index > 1) {
            section.classList.remove('expanded');
        }

        header.addEventListener('click', () => {
            const wasExpanded = section.classList.contains('expanded');

            // Optional: Close other sections (accordion behavior)
            // collapsibles.forEach(s => s.classList.remove('expanded'));

            // Toggle current section
            section.classList.toggle('expanded');

            console.log(`📂 Section ${wasExpanded ? 'collapsed' : 'expanded'}`);
        });
    });

    console.log(`✅ Initialized ${collapsibles.length} collapsible sections`);
}

// ========================================
// 2. VIEW MORE/LESS FUNCTIONALITY
// ========================================

/**
 * Toggle Stories section
 */
function toggleStories() {
    const grid = document.querySelector('.stories-grid');
    const btn = document.getElementById('viewMoreStoriesBtn');

    if (!grid || !btn) return;

    const isExpanded = grid.classList.contains('expanded');

    if (isExpanded) {
        grid.classList.remove('expanded');
        btn.innerHTML = '📖 और कहानियाँ देखें (Show More)';
        // Scroll to section
        document.getElementById('hindi-stories')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        grid.classList.add('expanded');
        btn.innerHTML = '🔼 कम दिखाएं (Show Less)';
    }

    console.log(`📖 Stories: ${isExpanded ? 'Collapsed' : 'Expanded'}`);
}

/**
 * Toggle Puzzles section
 */
function togglePuzzles() {
    const grid = document.querySelector('.puzzles-grid');
    const btn = document.getElementById('viewMorePuzzlesBtn');

    if (!grid || !btn) return;

    const isExpanded = grid.classList.contains('expanded');

    if (isExpanded) {
        grid.classList.remove('expanded');
        btn.innerHTML = '🤔 और पहेलियाँ देखें (Show More)';
        // Scroll to section
        document.getElementById('puzzles')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        grid.classList.add('expanded');
        btn.innerHTML = '🔼 कम दिखाएं (Show Less)';
    }

    console.log(`🤔 Puzzles: ${isExpanded ? 'Collapsed' : 'Expanded'}`);
}

/**
 * Toggle Gallery section
 */
function toggleGallery() {
    const grid = document.querySelector('.gallery-grid');
    const btn = document.getElementById('viewMoreGalleryBtn');

    if (!grid || !btn) return;

    const isExpanded = grid.classList.contains('expanded');

    if (isExpanded) {
        grid.classList.remove('expanded');
        btn.innerHTML = '🌟 और व्यक्तित्व देखें (Show More)';
        // Scroll to section
        document.getElementById('gallery')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        grid.classList.add('expanded');
        btn.innerHTML = '🔼 कम दिखाएं (Show Less)';
    }

    console.log(`🌟 Gallery: ${isExpanded ? 'Collapsed' : 'Expanded'}`);
}

// ========================================
// 3. TABBED NAVIGATION
// ========================================

/**
 * Initialize tab navigation
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            const tabGroup = button.closest('.tabs-container');

            if (!tabGroup || !targetTab) return;

            // Remove active from all buttons and contents in this group
            tabGroup.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            tabGroup.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Add active to clicked button
            button.classList.add('active');

            // Show corresponding content
            const targetContent = tabGroup.querySelector(`#${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            console.log(`🗂️ Tab switched to: ${targetTab}`);
        });
    });

    console.log(`✅ Initialized ${tabButtons.length} tab buttons`);
}

// ========================================
// 4. SCROLL DEPTH TRACKING (For testing)
// ========================================

/**
 * Calculate current scroll depth
 */
function trackScrollDepth() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    const scrollsRequired = Math.ceil(docHeight / window.innerHeight);

    return {
        scrollTop,
        docHeight,
        scrollPercent: scrollPercent.toFixed(1),
        scrollsRequired
    };
}

/**
 * Log scroll depth on scroll (for testing)
 */
let scrollTimeout;
function logScrollDepth() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const depth = trackScrollDepth();
        console.log(`📊 Scroll Depth: ${depth.scrollPercent}% | Scrolls needed: ${depth.scrollsRequired}`);
    }, 1000);
}

// ========================================
// 5. COMPACT HEADER ON SCROLL
// ========================================

/**
 * Make header more compact on scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

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
// 6. LAZY LOAD SECTIONS
// ========================================

/**
 * Lazy load sections when they come into view
 */
function initLazyLoad() {
    const sections = document.querySelectorAll('section[data-lazy]');

    if (sections.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                section.classList.add('loaded');
                observer.unobserve(section);
                console.log(`📦 Lazy loaded section: ${section.id}`);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    console.log(`📦 Lazy loading ${sections.length} sections`);
}

// ========================================
// 7. SMOOTH SCROLL TO TOP
// ========================================

/**
 * Add "Back to Top" button
 */
function initBackToTop() {
    // Create button if it doesn't exist
    let backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTop';
        backToTopBtn.innerHTML = '⬆️';
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #FF6B35, #FFC107);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 999;
        `;
        document.body.appendChild(backToTopBtn);

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    console.log('⬆️ Back to top button initialized');
}

// ========================================
// 8. COMPRESS EMPTY SECTIONS
// ========================================

/**
 * Hide sections that have no content
 */
function compressEmptySections() {
    const sections = document.querySelectorAll('section');
    let hiddenCount = 0;

    sections.forEach(section => {
        const content = section.textContent.trim();
        const hasImages = section.querySelector('img');
        const hasCards = section.querySelector('.card, [class*="card"]');

        // If section is nearly empty and has no meaningful content
        if (content.length < 50 && !hasImages && !hasCards) {
            section.style.display = 'none';
            hiddenCount++;
            console.log(`🗜️ Compressed empty section: ${section.id}`);
        }
    });

    if (hiddenCount > 0) {
        console.log(`✅ Compressed ${hiddenCount} empty sections`);
    }
}

// ========================================
// 9. CALCULATE & DISPLAY SCROLL STATS
// ========================================

/**
 * Show scroll statistics overlay (for testing)
 */
function showScrollStats() {
    const depth = trackScrollDepth();

    let statsOverlay = document.getElementById('scrollStats');

    if (!statsOverlay) {
        statsOverlay = document.createElement('div');
        statsOverlay.id = 'scrollStats';
        statsOverlay.style.cssText = `
            position: fixed;
            top: 80px;
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
        document.body.appendChild(statsOverlay);
    }

    statsOverlay.innerHTML = `
        <div style="margin-bottom: 4px;">📊 Scroll Depth: ${depth.scrollPercent}%</div>
        <div>🔢 Scrolls Needed: ${depth.scrollsRequired}</div>
    `;
}

// ========================================
// 10. INITIALIZATION
// ========================================

/**
 * Initialize all compact features on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Ultra Compact Mode...');

    // Core features
    initCollapsibleSections();
    initTabs();
    initHeaderScroll();
    initBackToTop();

    // Optional features
    initLazyLoad();
    compressEmptySections();

    // For testing: Track scroll depth
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.addEventListener('scroll', logScrollDepth);
        showScrollStats();

        // Update stats every 500ms
        setInterval(showScrollStats, 500);
    }

    // Calculate initial scroll depth
    setTimeout(() => {
        const depth = trackScrollDepth();
        console.log(`✅ Page loaded! Scrolls required: ${depth.scrollsRequired}`);
        console.log(`🎯 Target: 5 scrolls | Current: ${depth.scrollsRequired} scrolls`);

        if (depth.scrollsRequired <= 5) {
            console.log('🎉 SUCCESS! Page is ultra-compact (≤5 scrolls)');
        } else {
            console.warn(`⚠️ Still needs work. Current: ${depth.scrollsRequired} scrolls`);
        }
    }, 1000);

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    console.log('✅ Ultra Compact Mode Activated!');
});

// ========================================
// 11. EXPORT FOR DEBUGGING
// ========================================

// Make functions available globally for debugging
window.HamarPadhaiCompact = {
    toggleStories,
    togglePuzzles,
    toggleGallery,
    trackScrollDepth,
    showScrollStats,
    initCollapsibleSections,
    initTabs
};

console.log('📦 HamarPadhaiCompact functions available globally');
