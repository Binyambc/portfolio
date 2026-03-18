// ===== HELPER FUNCTIONS =====
function getElement(selector) {
    return document.querySelector(selector);
}

function getElementById(id) {
    return document.getElementById(id);
}

function getElements(selector) {
    return document.querySelectorAll(selector);
}

function safeAddEventListener(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
    }
}

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
    const navMenu = getElementById("navLinks");
    const hamburgerBtn = getElement('.hamburger');
    const closeMenuBtn = getElementById("closeMenu");
    
    if (!navMenu || !hamburgerBtn || !closeMenuBtn) return;
    
    function openMenu() {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        navMenu.classList.add('active');
        document.body.classList.add('nav-menu-open');
        document.body.style.top = `-${scrollY}px`;
    }
    
    function closeMenu() {
        const scrollY = Math.abs(parseInt(document.body.style.top || '0', 10));
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-menu-open');
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
    }
    
    safeAddEventListener(hamburgerBtn, 'click', openMenu);
    safeAddEventListener(closeMenuBtn, 'click', closeMenu);
    
    const navLinks = getElements('.nav-links a');
    navLinks.forEach(link => {
        safeAddEventListener(link, 'click', closeMenu);
    });
    
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            closeMenu();
        }
    });
}

// ===== THEME FUNCTIONALITY =====
function initTheme() {
    const themeBtn = getElementById("darkModeToggle");
    const themeIcon = getElementById("darkModeIcon");
    
    function toggleTheme() {
        document.body.classList.toggle("dark-mode");
        const isDarkMode = document.body.classList.contains("dark-mode");
        
        if (themeIcon) {
            if (isDarkMode) {
                themeIcon.classList.replace("fa-moon", "fa-sun");
            } else {
                themeIcon.classList.replace("fa-sun", "fa-moon");
            }
        }
    }
    
    if (themeBtn) {
        safeAddEventListener(themeBtn, 'click', toggleTheme);
    }
}

// ===== SCROLL FUNCTIONALITY =====
function initScroll() {
    const topButton = getElementById("topBtn");
    const header = getElement("header");

    function handleScroll() {
        const scrollY = document.body.scrollTop || document.documentElement.scrollTop;
        if (header) header.classList.toggle("header-scrolled", scrollY > 10);
        if (topButton) topButton.style.display = scrollY > 100 ? "block" : "none";
    }

    function backToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    if (topButton) safeAddEventListener(topButton, 'click', backToTop);
}

// ===== INFINITE CAROUSEL (Projects + Skills) =====
// Same logic for both: clone until track is at least 2× viewport, then seamless loop (no gap).
function initInfiniteCarousel(carouselSelector, trackSelector, speed = 0.5) {
    const carousel = document.querySelector(carouselSelector);
    const track = document.querySelector(trackSelector);
    if (!carousel || !track) return;

    let position = 0;
    let baseWidth = 0;
    let repeatCount = 1;

    let isPaused = false;
    let isDragging = false;
    let startX = 0;

    let originalItems = [];

    function recalcBaseWidth() {
        const originalsLen = originalItems.length || 1;
        repeatCount = Math.max(1, Math.round(track.children.length / originalsLen));
        baseWidth = repeatCount > 0 ? (track.scrollWidth / repeatCount) : track.scrollWidth;
    }

    // --- Setup clones ---
    function setup() {
        // Reset
        track.innerHTML = "";
        position = 0;

        // Rebuild track
        originalItems.forEach(el => track.appendChild(el));
        recalcBaseWidth();

        // Clone original set until we cover the viewport + one full cycle
        while (track.scrollWidth < carousel.offsetWidth + baseWidth) {
            originalItems.forEach(node => {
                const clone = node.cloneNode(true);
                clone.setAttribute("aria-hidden", "true");
                track.appendChild(clone);
            });
            recalcBaseWidth();
        }

        track.style.transform = `translateX(0px)`;
    }

    // --- Animation loop ---
    function animate() {
        if (!isPaused && !isDragging) {
            position -= speed;
        }

        // Seamless wrap
        if (position <= -baseWidth || position > 0) {
            recalcBaseWidth();
            if (baseWidth > 0) {
                while (position <= -baseWidth) position += baseWidth;
                while (position > 0) position -= baseWidth;
            }
        }

        track.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(animate);
    }

    // --- Mouse drag ---
    carousel.addEventListener("mousedown", (e) => {
        isDragging = true;
        isPaused = true;
        startX = e.clientX;
        e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        const delta = e.clientX - startX;
        startX = e.clientX;
        position += delta;
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
        isPaused = false;

        // Normalize after drag
        recalcBaseWidth();
        if (baseWidth > 0) {
            while (position > 0) position -= baseWidth;
            while (position <= -baseWidth) position += baseWidth;
        }
    });

    // --- Touch drag ---
    carousel.addEventListener("touchstart", (e) => {
        isDragging = true;
        isPaused = true;
        startX = e.touches[0].clientX;
    });

    carousel.addEventListener("touchmove", (e) => {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const delta = currentX - startX;
        startX = currentX;
        position += delta;
    });

    carousel.addEventListener("touchend", () => {
        isDragging = false;
        isPaused = false;

        recalcBaseWidth();
        if (baseWidth > 0) {
            while (position > 0) position -= baseWidth;
            while (position <= -baseWidth) position += baseWidth;
        }
    });

    // --- Hover pause ---
    carousel.addEventListener("mouseenter", () => isPaused = true);
    carousel.addEventListener("mouseleave", () => {
        if (!isDragging) isPaused = false;
    });

    // --- Resize handling ---
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setup();
        }, 100);
    });

    // --- Init ---
    window.addEventListener("load", () => {
        // Capture originals BEFORE clearing
        originalItems = Array.from(track.children);
        // If images are lazy-loading, widths can still change after load; keep baseWidth fresh.
        track.querySelectorAll('img').forEach((img) => {
            safeAddEventListener(img, 'load', recalcBaseWidth);
        });
        setup();
        animate();
    });
}

// ===== ABOUT LIGHTBOX (click about card → lightbox with detail text + category images) =====
const ABOUT_DATA = {
    'architect': {
        title: 'Architect',
        text: 'Studied Architecture and Urban Planning at Addis Ababa University and graduated with a BSc. in 2007. After graduation, I spent some time working on private residences, apartment and hotel buildings.',
        images: [
            { src: 'images/hotel.webp', alt: 'Hotel' },
            { src: 'images/residence_3d.webp', alt: 'Residence 3D' },
            { src: 'images/residence_ground_floor.webp', alt: 'Residence ground floor' },
            { src: 'images/residence_site_plan.webp', alt: 'Residence site plan' }
        ]
    },
    'vector-designer': {
        title: 'Vector Designer',
        text: 'My choice of application for vector so far has been Affinity designer. Most of the works that I have done are expressions of my passion towards my roots from Ethiopia.',
        images: [
            { src: 'images/zelephant.webp', alt: 'Zelephant' },
            { src: 'images/genna.webp', alt: 'Genna' },
            { src: 'images/bunna.webp', alt: 'Bunna' },
            { src: 'images/emblem_lion.webp', alt: 'Emblem lion' },
            { src: 'images/gridLion.webp', alt: 'Grid lion' }
        ]
    },
    'photographer': {
        title: 'Photographer',
        text: 'This has been a passion that I pushed with the least convenient possible tools. I knew anyway that I have keen eye for good juxtaposition and framing. My go to subjects are urban corridors mostly reflected in puddles.',
        images: [
            { src: 'images/stand_out.webp', alt: 'Stand out' }
        ]
    },
    'entrepreneur': {
        title: 'Entrepreneur',
        text: 'I have spent over five years as an entrepreneur running a small plc providing delivery services and export. After this I also co-founded and run a furniture recycling and upcycling firm where me and my business partner practiced circular economy extending the life cycle of furnitures that otherwise would have been regarded as waste.',
        images: [
            { src: 'images/unelma-logo.jpg', alt: 'Unelma' }
        ]
    },
    'full-stack': {
        title: 'Full stack web developer',
        text: 'I have always been curious about coding but never got the chance to study it. On January of 2025, I joined the Full stack web developer program provided at Business College Helsinki. I have now a much better understanding of HTML, JS, CSS and some basics of React, PHP, Laravel and Database systems. Git/GitHub is the main platform we use for version control whilst studying some of AWS services.',
        images: []
    },
    'cook': {
        title: 'Self claimed cook',
        text: 'This is a passion that formed out of necessity. I did work at a restaurant during my studies but at the same time living away from home where you have to do everything yourself forced me to learn to cook and set plates in appealing manners.',
        images: []
    }
};

function initAboutLightbox() {
    const lightbox = getElementById('aboutLightbox');
    const titleEl = getElementById('aboutLightboxTitle');
    const textEl = getElementById('aboutLightboxText');
    const galleryEl = getElementById('aboutLightboxGallery');
    const closeBtn = getElementById('aboutLightboxClose');

    if (!lightbox || !titleEl || !textEl || !galleryEl) return;

    function open(key) {
        const data = ABOUT_DATA[key];
        if (!data) return;
        titleEl.textContent = data.title;
        textEl.textContent = data.text;
        galleryEl.innerHTML = '';
        data.images.forEach(function (img, idx) {
            const el = document.createElement('img');
            el.src = img.src;
            el.alt = img.alt;
            el.loading = 'lazy';
            el.setAttribute('role', 'button');
            el.setAttribute('tabindex', '0');
            safeAddEventListener(el, 'click', function () {
                close();
                if (typeof window.openImageLightbox === 'function') {
                    window.openImageLightbox(data.images, idx);
                }
            });
            safeAddEventListener(el, 'keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    close();
                    if (typeof window.openImageLightbox === 'function') {
                        window.openImageLightbox(data.images, idx);
                    }
                }
            });
            galleryEl.appendChild(el);
        });
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    getElements('.about-card').forEach(function (card) {
        const key = card.getAttribute('data-about');
        if (key) safeAddEventListener(card, 'click', function () { open(key); });
    });

    if (closeBtn) safeAddEventListener(closeBtn, 'click', close);
    safeAddEventListener(lightbox, 'click', function (e) {
        if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
    });
}

// ===== PROJECT LIGHTBOX (click carousel image or about gallery image → lightbox with prev/next + pinch zoom) =====
function initProjectLightbox() {
    const track = getElement('.carousel-track');
    const lightbox = getElementById('projectLightbox');
    const lightboxImage = getElementById('projectLightboxImage');
    const closeBtn = getElementById('projectLightboxClose');
    const prevBtn = getElementById('projectLightboxPrev');
    const nextBtn = getElementById('projectLightboxNext');

    if (!lightbox || !lightboxImage) return;

    const allImgs = track ? Array.from(track.querySelectorAll('img')) : [];
    const seen = new Set();
    const defaultList = [];
    allImgs.forEach((img) => {
        if (!seen.has(img.src)) {
            seen.add(img.src);
            defaultList.push({ src: img.src, alt: img.alt });
        }
    });

    let customList = null;
    function getImageList() {
        return (customList && customList.length) ? customList : defaultList;
    }

    let currentIndex = 0;

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let pinchStartDist = 0;
    let pinchStartScale = 1;
    let lastCenterX = 0;
    let lastCenterY = 0;

    function resetZoom() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        lightboxImage.style.transform = '';
    }

    function applyZoom() {
        lightboxImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    function open(index) {
        const list = getImageList();
        if (list.length === 0) return;
        currentIndex = (index + list.length) % list.length;
        const item = list[currentIndex];
        lightboxImage.src = item.src;
        lightboxImage.alt = item.alt;
        resetZoom();
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        customList = null;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        resetZoom();
    }

    function openWithImages(images, index) {
        if (!images || !images.length) return;
        customList = images.map(function (img) { return { src: img.src, alt: img.alt }; });
        open(typeof index === 'number' ? index : 0);
    }

    window.openImageLightbox = openWithImages;

    function getTouchDistance(touches) {
        return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    }
    function getTouchCenter(touches) {
        return { x: (touches[0].clientX + touches[1].clientX) / 2, y: (touches[0].clientY + touches[1].clientY) / 2 };
    }

    safeAddEventListener(lightboxImage, 'touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            pinchStartDist = getTouchDistance(e.touches);
            pinchStartScale = scale;
            const c = getTouchCenter(e.touches);
            lastCenterX = c.x;
            lastCenterY = c.y;
        }
    }, { passive: false });

    safeAddEventListener(lightboxImage, 'touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dist = getTouchDistance(e.touches);
            const c = getTouchCenter(e.touches);
            scale = Math.max(0.5, Math.min(4, pinchStartScale * (dist / pinchStartDist)));
            translateX += c.x - lastCenterX;
            translateY += c.y - lastCenterY;
            lastCenterX = c.x;
            lastCenterY = c.y;
            applyZoom();
        }
    }, { passive: false });

    safeAddEventListener(lightboxImage, 'touchend', (e) => {
        if (e.touches.length < 2) pinchStartDist = 0;
    });

    if (track && defaultList.length) {
        safeAddEventListener(track, 'click', (e) => {
            const img = e.target.closest('img');
            if (!img) return;
            const idx = defaultList.findIndex((u) => u.src === img.src);
            if (idx >= 0) open(idx);
        });
    }

    if (closeBtn) safeAddEventListener(closeBtn, 'click', close);
    if (prevBtn) safeAddEventListener(prevBtn, 'click', (e) => { e.stopPropagation(); open(currentIndex - 1); });
    if (nextBtn) safeAddEventListener(nextBtn, 'click', (e) => { e.stopPropagation(); open(currentIndex + 1); });

    safeAddEventListener(lightbox, 'click', (e) => {
        if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') open(currentIndex - 1);
        if (e.key === 'ArrowRight') open(currentIndex + 1);
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = getElementById('contactForm');
    const messageEl = getElementById('contactFormMessage');
    const submitBtn = getElementById('contactSubmitBtn');

    if (!form || !messageEl || !submitBtn) return;

    function showMessage(text, isError) {
        messageEl.textContent = text;
        messageEl.hidden = false;
        messageEl.classList.toggle('contact-form-message--error', isError);
        messageEl.classList.toggle('contact-form-message--success', !isError);
    }

    function hideMessage() {
        messageEl.hidden = true;
        messageEl.textContent = '';
        messageEl.classList.remove('contact-form-message--error', 'contact-form-message--success');
    }

    safeAddEventListener(form, 'submit', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const honeypot = (form.website && form.website.value) ? form.website.value.trim() : '';
        if (honeypot) {
            showMessage('Thanks! Your message has been sent.', false);
            form.reset();
            return;
        }

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        hideMessage();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            });
            const data = await res.json().catch(() => ({}));

            if (res.ok && data.success) {
                showMessage('Thanks! Your message has been sent.', false);
                form.reset();
            } else {
                showMessage(data.error || 'Something went wrong. Please try again.', true);
            }
        } catch {
            showMessage('Network error. Please check your connection and try again.', true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}

// Initialization order: header/nav → theme → scroll/back-to-top → projects carousel + lightbox → skills → contact.
// Each init wrapped in try/catch so one failure (e.g. on mobile) doesn't break the whole page.
function init() {
    try { initNavigation(); } catch (e) { console.warn('initNavigation', e); }
    try { initTheme(); } catch (e) { console.warn('initTheme', e); }
    try { initScroll(); } catch (e) { console.warn('initScroll', e); }
    try { initInfiniteCarousel(".carousel", ".carousel-track", 1); } catch (e) { console.warn('initCarousel', e); }
    try { initProjectLightbox(); } catch (e) { console.warn('initProjectLightbox', e); }
    try { initAboutLightbox(); } catch (e) { console.warn('initAboutLightbox', e); }
    try { initContactForm(); } catch (e) { console.warn('initContactForm', e); }
}

document.addEventListener('DOMContentLoaded', init);