
const carousel = document.querySelector(".carousel");
const track = document.querySelector(".carousel-track");
const totalWidth = track.scrollWidth / 2;
let isPaused = false;

const navMenu = document.getElementById("navLinks");
const faBar = document.querySelector('.fa-bars');
const themeBtn = document.getElementById("darkModeToggle");
const themeIcon = document.getElementById("darkModeIcon");
const topButton = document.getElementById("topBtn");

const iconCarousel = document.querySelector(".round_carousel");
const icons = iconCarousel.querySelectorAll(".icon");
const activeLabel = document.querySelector(".active-label");

const radius = 200;
let angle = 0;

function autoScroll() {
    if (!isPaused) {
        carousel.scrollLeft += 1;
        if (carousel.scrollLeft >= totalWidth) {
            carousel.scrollLeft -= totalWidth;
        }
    }
    requestAnimationFrame(autoScroll);
}
requestAnimationFrame(autoScroll);

function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        topButton.style.display = "block";
    } else {
        topButton.style.display = "none";
    }
}

window.onscroll = function () { scrollFunction() };

function backToTopFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

faBar.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

carousel.addEventListener("mouseenter", () => {
    isPaused = true;
});
carousel.addEventListener("mouseleave", () => {
    isPaused = false;
});

carousel.addEventListener("touchstart", () => {
    isPaused = true;
});
carousel.addEventListener("touchend", () => {
    isPaused = false;
});

topButton.addEventListener('click', backToTopFunction);

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
        themeIcon.classList.replace("fa-sun", "fa-moon");
    }
});

function positionIcons() {
    const step = (2 * Math.PI) / icons.length;
    let highestY = -Infinity;
    let topIcon = null;

    icons.forEach((icon, index) => {
        const x = radius * Math.cos(angle + step * index);
        const y = radius * Math.sin(angle + step * index);

        icon.style.position = "absolute";
        icon.style.transform = `translate(${x + 160}px, ${y + 160}px)`;

        if (y < highestY || highestY === -Infinity) {
            highestY = y;
            topIcon = icon;
        }
    });

    icons.forEach(i => i.classList.remove("active"));
    if (topIcon) {
        topIcon.classList.add("active");
        activeLabel.textContent = topIcon.alt || "Unknown";
    }
}

function rotateIconCarousel() {
    angle += 0.003;
    positionIcons();
    requestAnimationFrame(rotateIconCarousel);
}

positionIcons();
rotateIconCarousel();
