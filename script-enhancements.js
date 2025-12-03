/*
 * हमार पढ़ाई - UI Enhancement Scripts
 * Modern Interactive Features for "Bhaokal Tight" Experience
 * Senior Frontend Developer: Complete UI Overhaul Part 2
 */

// ===== SCROLL ANIMATIONS (Intersection Observer) =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const elementsToAnimate = document.querySelectorAll(
        'section, .card, .setup-card, .personality-card, .story-card, .puzzle-card, .progress-card'
    );

    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // Header scroll effect
    const header = document.querySelector('.main-header');
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

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
});

// ===== GALLERY TAB SWITCHING =====
function showGalleryCategory(category) {
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.gallery-tab-button');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Add active class to clicked tab
    const activeTab = document.querySelector('[onclick*="' + category + '"]');
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Hide all gallery grids
    const allGalleries = document.querySelectorAll('.gallery-grid');
    allGalleries.forEach(gallery => gallery.classList.add('hidden'));

    // Show selected category content (ID format: gallery-{category})
    const selectedContent = document.getElementById('gallery-' + category);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');

        // Trigger fade-in animation for cards
        const cards = selectedContent.querySelectorAll('.personality-card');
        cards.forEach((card, index) => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease ' + (index * 0.1) + 's forwards';
            }, 10);
        });
    } else {
        console.error('Gallery not found:', 'gallery-' + category);
    }
}

// ===== STORY MODAL =====
let storyModal = null;

function openStory(storyId) {
    // Create modal if it doesn't exist
    if (!storyModal) {
        storyModal = document.createElement('div');
        storyModal.className = 'modal';
        storyModal.innerHTML = '<div class="modal-content"><button class="modal-close" onclick="closeStoryModal()">&times;</button><h2 class="modal-title" id="storyModalTitle"></h2><div class="modal-body" id="storyModalBody"></div></div>';
        document.body.appendChild(storyModal);

        // Close modal when clicking outside
        storyModal.addEventListener('click', (e) => {
            if (e.target === storyModal) {
                closeStoryModal();
            }
        });
    }

    // Story data (placeholder - replace with actual content)
    const stories = {
        1: {
            title: "चालाक लोमड़ी और कौआ",
            content: "एक बार की बात है, एक कौआ एक पेड़ पर बैठा था। उसकी चोंच में एक रोटी का टुकड़ा था। <br><br>एक चालाक लोमड़ी उधर से गुजरी। उसने रोटी देखी और सोचा, \"यह रोटी मुझे चाहिए!\"<br><br>लोमड़ी ने कौए से कहा: \"वाह! आप कितने सुंदर हैं! आपकी आवाज़ भी जरूर बहुत मधुर होगी। क्या आप मुझे एक गाना सुना सकते हैं?\"<br><br>कौआ खुश हो गया। उसने अपनी तारीफ सुनी और गाना शुरू कर दिया: \"काँव! काँव!\"<br><br>जैसे ही कौए ने अपनी चोंच खोली, रोटी नीचे गिर गई। चालाक लोमड़ी ने तुरंत उसे उठाया और भाग गई।<br><br><strong>सीख:</strong> चापलूसी में न आएं। अपनी अक्ल का इस्तेमाल करें! 🦊🐦"
        },
        2: {
            title: "बंदर और मगरमच्छ",
            content: "एक जामुन के पेड़ पर एक बंदर रहता था। नदी में एक मगरमच्छ रहता था।<br><br>बंदर रोज़ मगरमच्छ को मीठे जामुन देता था। दोनों अच्छे दोस्त बन गए।<br><br>एक दिन मगरमच्छ की पत्नी ने कहा: \"मुझे बंदर का दिल खाना है! वह बहुत मीठा होगा।\"<br><br>मगरमच्छ ने दुखी मन से बंदर को अपनी पीठ पर बिठाया और कहा: \"मेरी पत्नी तुम्हें खाना बुलाया है।\"<br><br>रास्ते में मगरमच्छ ने सच बता दिया। बंदर ने चालाकी से कहा: \"अरे! मेरा दिल तो मैं पेड़ पर भूल आया हूं। चलो वापस लाते हैं!\"<br><br>पेड़ पर पहुंचते ही बंदर ऊपर चढ़ गया और बोला: \"मूर्ख! दिल शरीर के अंदर होता है, पेड़ पर नहीं!\"<br><br><strong>सीख:</strong> मुसीबत में अपनी बुद्धि का प्रयोग करें! 🐒🐊"
        }
    };

    const story = stories[storyId] || {
        title: "कहानी जल्द आ रही है...",
        content: "यह कहानी जल्द ही उपलब्ध होगी। कृपया बाद में देखें! 📖"
    };

    // Populate modal content
    document.getElementById('storyModalTitle').textContent = story.title;
    document.getElementById('storyModalBody').innerHTML = story.content;

    // Show modal
    storyModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeStoryModal() {
    if (storyModal) {
        storyModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && storyModal && storyModal.classList.contains('active')) {
        closeStoryModal();
    }
});

// ===== PUZZLE ANSWER TOGGLE =====
function toggleAnswer(puzzleId) {
    const answerElement = document.getElementById('answer-' + puzzleId);
    if (!answerElement) return;

    const button = answerElement.previousElementSibling;

    if (answerElement.classList.contains('visible')) {
        answerElement.classList.remove('visible');
        if (button) button.textContent = '👁️ जवाब दिखाएं';
    } else {
        answerElement.classList.add('visible');
        if (button) button.textContent = '🙈 जवाब छुपाएं';
    }
}

// ===== SMOOTH SCROLL TO QUIZ =====
function scrollToQuiz() {
    const quizSection = document.getElementById('quiz');
    if (quizSection) {
        quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== ACTIVE NAV LINK HIGHLIGHTING =====
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightActiveLink() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink);
    highlightActiveLink(); // Initial call
});

// ===== COMPUTER SECTION TAB SWITCHING =====
function showComputerCategory(category) {
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.computer-tab-button');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Add active class to clicked tab
    const activeTab = document.querySelector('[onclick*="showComputerCategory"][onclick*="' + category + '"]');
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Hide all computer content
    const contents = document.querySelectorAll('.computer-content');
    contents.forEach(content => content.classList.remove('active'));

    // Show selected category content
    const selectedContent = document.getElementById('computer-' + category);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
}

// ===== DOWNLOADS SECTION TAB SWITCHING =====
function showDownloadCategory(category) {
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.download-tab-button');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Add active class to clicked tab
    const activeTab = document.querySelector('[onclick*="showDownloadCategory"][onclick*="' + category + '"]');
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Hide all download content
    const contents = document.querySelectorAll('.download-content');
    contents.forEach(content => content.classList.remove('active'));

    // Show selected category content
    const selectedContent = document.getElementById('download-' + category);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
}

// ===== DOWNLOAD SAMPLE FILES =====
function downloadSample(fileName) {
    // Placeholder function - in production, this would trigger actual file download
    alert('डाउनलोड शुरू हो रहा है: ' + fileName + '\n\nनोट: यह एक डेमो है। असली फाइलें जल्द ही उपलब्ध होंगी!');
}

// ===== EMAIL NOTIFICATION SIGNUP =====
function submitNotifyRequest() {
    const emailInput = document.getElementById('notifyEmail');
    if (!emailInput) return;

    const email = emailInput.value.trim();

    if (!email) {
        alert('कृपया अपना ईमेल एड्रेस डालें!');
        return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('कृपया सही ईमेल एड्रेस डालें!');
        return;
    }

    // Store in localStorage (in production, send to backend)
    const notifications = JSON.parse(localStorage.getItem('notifyEmails') || '[]');

    if (notifications.includes(email)) {
        alert('यह ईमेल पहले से रजिस्टर है!');
        return;
    }

    notifications.push(email);
    localStorage.setItem('notifyEmails', JSON.stringify(notifications));

    alert('धन्यवाद! आपको नई सामग्री की सूचना मिल जाएगी। 📧✅');
    emailInput.value = '';
}

// ===== HISTORICAL IMAGES FUNCTIONS =====
function shareHistoricalImage(imageId) {
    if (navigator.share) {
        navigator.share({
            title: 'हमार पढ़ाई - ऐतिहासिक तस्वीर',
            text: 'देखिए यह दुर्लभ ऐतिहासिक तस्वीर!',
            url: window.location.href + '#historical-images'
        }).catch(() => {
            copyImageLink();
        });
    } else {
        copyImageLink();
    }
}

function copyImageLink() {
    const url = window.location.href + '#historical-images';
    navigator.clipboard.writeText(url).then(() => {
        alert('लिंक कॉपी हो गया! अब किसी को भी शेयर करें। 📋✅');
    });
}

function saveImageToFavorites(imageId) {
    const favorites = JSON.parse(localStorage.getItem('favoriteImages') || '[]');

    if (favorites.includes(imageId)) {
        alert('यह तस्वीर पहले से Favorites में है! ⭐');
        return;
    }

    favorites.push(imageId);
    localStorage.setItem('favoriteImages', JSON.stringify(favorites));
    alert('तस्वीर Favorites में सेव हो गई! ⭐✅');
}

function loadMoreHistoricalImages() {
    alert('और तस्वीरें जल्द ही जोड़ी जाएंगी! 📸');
    // In production, this would load more images via AJAX
}

function filterHistoricalImages(category) {
    alert(category + ' की तस्वीरें जल्द ही उपलब्ध होंगी!');
}

let currentFactIndex = 0;
const historyFacts = [
    "जलियांवाला बाग नरसंहार में 1000+ लोग शहीद हुए थे। 😔",
    "दांडी मार्च में गांधीजी ने 241 मील पैदल चलकर नमक बनाया था। 🚶",
    "भारत को आजादी मिलने में 200 साल लगे। 🇮🇳",
    "भगत सिंह जब फांसी पर चढ़े तो मुस्कुरा रहे थे। 💪",
    "नेताजी सुभाष चंद्र बोस ने 'तुम मुझे खून दो' का नारा दिया। 🔥"
];

function showNextHistoryFact() {
    const factElement = document.getElementById('currentHistoryFact');
    if (!factElement) return;

    currentFactIndex = (currentFactIndex + 1) % historyFacts.length;

    // Fade out
    factElement.style.opacity = '0';

    setTimeout(() => {
        factElement.textContent = historyFacts[currentFactIndex];
        // Fade in
        factElement.style.opacity = '1';
    }, 300);
}

// Auto-rotate history facts every 5 seconds
setInterval(showNextHistoryFact, 5000);

// ===== DID YOU KNOW - REFRESH FUNCTION =====
function refreshDidYouKnow() {
    const factsContainer = document.querySelector('.did-you-know-facts');
    if (!factsContainer) return;

    // Show loading state
    factsContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">तनी साबर करीं... 🔄</p>';

    // Simulate fetch (in production, fetch from Hindi Wikipedia API)
    setTimeout(() => {
        const facts = [
            "भारत में दुनिया का सबसे पुराना विश्वविद्यालय नालंदा था (बिहार का गर्व!)। 🎓",
            "शून्य (0) की खोज भारतीय गणितज्ञ आर्यभट्ट ने की थी। 🔢",
            "चंद्रयान-3 ने भारत को चंद्रमा के दक्षिणी ध्रुव पर उतरने वाला पहला देश बनाया। 🚀",
            "सावित्रीबाई फुले भारत की पहली महिला शिक्षिका थीं। 👩‍🏫",
            "जन गण मन गाने में ठीक 52 सेकंड लगते हैं। 🎵"
        ];

        factsContainer.innerHTML = facts.map((fact, index) =>
            '<div class="fact-item" style="animation: fadeInUp 0.6s ease ' + (index * 0.1) + 's forwards; opacity: 0;"><span class="fact-icon">💡</span><p class="fact-text">' + fact + '</p></div>'
        ).join('');
    }, 1000);
}

// ===== FEATURED PICTURE FUNCTIONS =====
function viewFullscreen(imageUrl) {
    // Create fullscreen modal
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 2rem;';

    modal.innerHTML = '<img src="' + imageUrl + '" style="max-width: 100%; max-height: 100%; object-fit: contain;"><button onclick="this.parentElement.remove(); document.body.style.overflow=\'\'" style="position: absolute; top: 2rem; right: 2rem; background: white; border: none; width: 50px; height: 50px; border-radius: 50%; font-size: 2rem; cursor: pointer;">×</button>';

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

function downloadFeaturedPic() {
    alert('डाउनलोड फीचर जल्द ही आ रहा है! 📥');
}

function shareFeaturedPic() {
    if (navigator.share) {
        navigator.share({
            title: 'आज की चुनिंदा तस्वीर - हमार पढ़ाई',
            text: 'देखिए Wikipedia की यह खूबसूरत तस्वीर!',
            url: window.location.href + '#featured-picture'
        }).catch(() => {
            copyImageLink();
        });
    } else {
        copyImageLink();
    }
}

function refreshFeaturedPic() {
    alert('नई तस्वीर रोज़ अपने आप अपडेट होती है! 🔄');
}

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images when they come into viewport
document.addEventListener('DOMContentLoaded', function() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
});

console.log('🎉 हमार पढ़ाई - UI Overhaul Complete! Bhaokal Tight! 💪');
