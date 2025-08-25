Portfolio Website (HTML • CSS • JS)

A responsive personal portfolio built with vanilla HTML, CSS, and JavaScript. It includes a sticky header with navigation, multiple content sections, dark/light mode, smooth scrolling, and a back-to-top control.

Features

Header navigation with anchor links

Sections: Home, Projects, Skills, About, Gallery and Contact

Dark/Light mode toggle with icon

Back to top button that appears after scrolling

Smooth scrolling for in-page links

Mobile-friendly layout and hamburger menu

Basic accessibility enhancements (aria labels, focus styles)

Tech Stack

HTML5

CSS3 (flexbox, media queries)

JavaScript (ES6)

Getting Started

1. Clone
   git clone https://github.com/Binyambc/portfolio.git
2. Run locally

Open index.html directly in your browser or serve it locally:

— VS Code Live Server (recommended)

Install the Live Server extension

Right-click index.html → Open with Live Server

File Structure
.
├── index.html
├── styles.css
├── main.js
├── images/
│ └── ... (logos, gallery, profile, favicon)
└── gallery.html

Usage

Click nav links to jump between sections (smooth scroll).

Use the moon/sun icon to toggle dark/light mode.

Back to top appears after scrolling; click to return to the header.

Customization

Update colors in :root in styles.css (e.g., --accent-color).

Replace images in /images.

Edit copy in the About, Projects, and Skills sections.

Tweak breakpoints in media queries for your preferred responsive behavior.

Accessibility

Buttons/links include discernible names via aria-label.

Color contrasts tuned for dark/light themes.

Keyboard-friendly focus states.

Performance Tips

Use .webp images where possible.

Add loading="lazy" to noncritical images.

Minify CSS/JS for production if needed.

Project filter/tags

SEO: meta tags, Open Graph, sitemap

License

MIT — use, modify, and share freely.

Credits / Acknowledgments

This was onriginally strated as a school project. (Business College Helsinki)

Portfolio design and code by Binyam Angamo.

⚠️ Note: Portions of this codebase (e.g., carousel scripts) were generated with the assistance of AI. Final adaptations, integration, and design decisions are by Binyam Angamo.
