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
// One transform-based implementation: auto-scroll, touch drag, mouse drag. Clone track in JS for seamless loop.
function initInfiniteCarousel(carouselSelector, trackSelector, speed) {
    const carousel = getElement(carouselSelector);
    const track = getElement(trackSelector);
    if (!carousel || !track) return;

    let position = 0;
    let isPaused = false;
    let isDragging = false;
    let baseWidth = 0;
    let originalCount = 0;

    function cloneUntilFilled() {
        if (originalCount === 0) {
            originalCount = track.children.length;
        }
        const originals = Array.from(track.children);
        while (track.scrollWidth < carousel.offsetWidth * 2) {
            originals.forEach((node) => {
                const clone = node.cloneNode(true);
                clone.setAttribute("aria-hidden", "true");
                track.appendChild(clone);
            });
        }
        baseWidth = track.scrollWidth / 2;
    }

    function animate() {
        if (!isPaused) {
            position -= speed;
            if (position <= -baseWidth) position += baseWidth;
            track.style.transform = `translateX(${position}px)`;
        }
        requestAnimationFrame(animate);
    }

    safeAddEventListener(carousel, "mouseenter", () => { isPaused = true; });
    safeAddEventListener(carousel, "mouseleave", () => {
        isPaused = false;
        isDragging = false;
    });

    let startX = 0;
    safeAddEventListener(carousel, "mousedown", (e) => {
        e.preventDefault();
        isPaused = true;
        isDragging = true;
        startX = e.clientX;
    });
    safeAddEventListener(carousel, "mousemove", (e) => {
        if (!isDragging) return;
        const delta = e.clientX - startX;
        startX = e.clientX;
        position += delta;
        track.style.transform = `translateX(${position}px)`;
    });
    safeAddEventListener(carousel, "mouseup", () => {
        isPaused = false;
        isDragging = false;
    });

    safeAddEventListener(carousel, "touchstart", (e) => {
        isPaused = true;
        startX = e.touches[0].clientX;
    });
    safeAddEventListener(carousel, "touchmove", (e) => {
        const currentX = e.touches[0].clientX;
        const delta = currentX - startX;
        startX = currentX;
        position += delta;
        track.style.transform = `translateX(${position}px)`;
    });
    safeAddEventListener(carousel, "touchend", () => {
        isPaused = false;
    });

    safeAddEventListener(window, "resize", () => {
        while (track.children.length > originalCount) {
            track.removeChild(track.lastChild);
        }
        track.style.transform = "translateX(0)";
        position = 0;
        cloneUntilFilled();
    });

    safeAddEventListener(window, "load", () => {
        cloneUntilFilled();
        animate();
    });
}

// ===== GALLERY LIGHTBOX =====
function initGalleryLightbox() {
    const grid = getElement('.gallery-grid');
    const lightbox = getElementById('galleryLightbox');
    const lightboxImage = getElementById('lightboxImage');
    const closeBtn = getElementById('lightboxClose');
    const prevBtn = getElementById('lightboxPrev');
    const nextBtn = getElementById('lightboxNext');

    if (!grid || !lightbox || !lightboxImage) return;

    const images = Array.from(grid.querySelectorAll('img'));
    let currentIndex = 0;
    let scrollY = 0;

    function open(index) {
        currentIndex = (index + images.length) % images.length;
        const img = images[currentIndex];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        scrollY = window.scrollY || document.documentElement.scrollTop;
        document.body.classList.add('lightbox-open');
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
    }

    function showPrev() {
        open(currentIndex - 1);
    }

    function showNext() {
        open(currentIndex + 1);
    }

    images.forEach((img, index) => {
        safeAddEventListener(img, 'click', () => open(index));
    });

    if (closeBtn) safeAddEventListener(closeBtn, 'click', close);
    if (prevBtn) safeAddEventListener(prevBtn, 'click', (e) => { e.stopPropagation(); showPrev(); });
    if (nextBtn) safeAddEventListener(nextBtn, 'click', (e) => { e.stopPropagation(); showNext(); });

    safeAddEventListener(lightbox, 'click', (e) => {
        if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
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

// Initialization order follows page flow: header/nav → theme → scroll/back-to-top → projects → skills → gallery (if present) → contact.
function init() {
    initNavigation();
    initTheme();
    initScroll();
    initInfiniteCarousel(".carousel", ".carousel-track", 1);
    initInfiniteCarousel(".skills-carousel", ".skills-track", 0.6);
    initGalleryLightbox();
    initContactForm();
}

// Start everything when DOM is loaded
document.addEventListener('DOMContentLoaded', init);