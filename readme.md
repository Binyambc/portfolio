Portfolio Website (HTML • CSS • JS)

A responsive personal portfolio built with vanilla HTML, CSS, and JavaScript. It includes a sticky header with navigation, multiple content sections, dark/light mode, smooth scrolling, and a back-to-top control.

Features

Header navigation with anchor links

Sections: Home, Projects, Skills, About, Contact; Gallery page with lightbox

Dark/Light mode toggle with icon

Back to top button that appears after scrolling

Smooth scrolling for in-page links

Mobile-friendly layout and hamburger menu

Basic accessibility enhancements (aria labels, focus styles)

Tech Stack

HTML5

CSS3

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
├── gallery.html
├── styles.css
├── main.js
├── api/
│ └── contact.js
├── images/
│ └── ... (logos, gallery, profile, favicon)
└── readme.md

Contact form (when deployed on Vercel)

The contact form submits to a Vercel serverless function that sends email via Resend. To enable it:

1. Sign up at [resend.com](https://resend.com) and get an API key.
2. In the Vercel project dashboard: Settings → Environment Variables.
3. Add:
   - `RESEND_API_KEY` = your Resend API key
   - `CONTACT_EMAIL` = the email where you want to receive messages (e.g. you@example.com)
4. Redeploy. Messages will be sent from `onboarding@resend.dev` until you verify your own domain in Resend.

If the form returns **500**: ensure `RESEND_API_KEY` and `CONTACT_EMAIL` are set in Vercel (Settings → Environment Variables) and redeploy.

Usage

Click nav links to jump between sections (smooth scroll).

Use the moon/sun icon to toggle dark/light mode.

Back to top appears after scrolling; click to return to the header.

Customization

Update colors in :root in styles.css (e.g., --accent).

Replace images in /images.

Edit copy in the About, Projects, and Skills sections.

Tweak breakpoints in media queries for your preferred responsive behavior.

Accessibility

Buttons/links include discernible names via aria-label.

Color contrasts tuned for dark/light themes.

Keyboard-friendly focus states.

Performance Tips

- **Images:** Use .webp where possible. Key images use `loading="lazy"` and `decoding="async"`. The LCP image (profile) is preloaded and has `fetchpriority="high"`. To reduce "Improve image delivery" further: resize images to the max display size (e.g. 400px wide for carousel) and compress (TinyPNG, Squoosh); consider `srcset` for responsive images.
- **Render blocking:** Font Awesome loads asynchronously (`media="print"` then `onload`). Main script uses `defer`. Critical CSS is in `styles.css`; keep it lean.
- **Fonts:** If you add a web font (e.g. Google Fonts for Raleway), use `&display=swap` in the URL so text shows immediately with a fallback font.
- Minify CSS/JS for production if needed.

Project filter/tags

SEO: meta tags, Open Graph, sitemap

License

MIT — use, modify, and share freely.

Credits / Acknowledgments

This was originally started as a school project. (Business College Helsinki)

Portfolio design and code by Binyam Angamo.

⚠️ Note: Portions of this codebase (e.g., carousel scripts) were generated with the assistance of AI. Final adaptations, integration, and design decisions are by Binyam Angamo.
