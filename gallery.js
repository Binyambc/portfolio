/**
 * Minimal script for gallery page only: nav, theme, scroll, lightbox.
 * No carousel or contact form — keeps memory and parse cost low on mobile.
 */
function getElement(selector) {
    return document.querySelector(selector);
}
function getElementById(id) {
    return document.getElementById(id);
}
function getElements(selector) {
    return document.querySelectorAll(selector);
}
function safeAddEventListener(el, event, handler) {
    if (el) el.addEventListener(event, handler);
}

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
    getElements('.nav-links a').forEach(link => safeAddEventListener(link, 'click', closeMenu));
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) closeMenu();
    });
}

function initTheme() {
    const themeBtn = getElementById("darkModeToggle");
    const themeIcon = getElementById("darkModeIcon");
    if (!themeBtn) return;
    safeAddEventListener(themeBtn, 'click', () => {
        document.body.classList.toggle("dark-mode");
        if (themeIcon) {
            const isDark = document.body.classList.contains("dark-mode");
            themeIcon.classList.replace(isDark ? "fa-moon" : "fa-sun", isDark ? "fa-sun" : "fa-moon");
        }
    });
}

function initScroll() {
    const topBtn = getElementById("topBtn");
    const header = getElement("header");
    function handleScroll() {
        const y = document.body.scrollTop || document.documentElement.scrollTop;
        if (header) header.classList.toggle("header-scrolled", y > 10);
        if (topBtn) topBtn.style.display = y > 100 ? "block" : "none";
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    if (topBtn) safeAddEventListener(topBtn, 'click', () => { document.body.scrollTop = 0; document.documentElement.scrollTop = 0; });
}

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
    function open(index) {
        currentIndex = (index + images.length) % images.length;
        const img = images[currentIndex];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function close() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    images.forEach((img, i) => safeAddEventListener(img, 'click', () => open(i)));
    if (closeBtn) safeAddEventListener(closeBtn, 'click', close);
    if (prevBtn) safeAddEventListener(prevBtn, 'click', (e) => { e.stopPropagation(); open(currentIndex - 1); });
    if (nextBtn) safeAddEventListener(nextBtn, 'click', (e) => { e.stopPropagation(); open(currentIndex + 1); });
    safeAddEventListener(lightbox, 'click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') open(currentIndex - 1);
        if (e.key === 'ArrowRight') open(currentIndex + 1);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme();
    initScroll();
    initGalleryLightbox();
});
