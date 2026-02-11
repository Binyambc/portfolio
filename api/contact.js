/**
 * Vercel serverless function: contact form → email via Resend.
 *
 * Required environment variables in Vercel:
 *   RESEND_API_KEY  - Your Resend API key (get at resend.com)
 *   CONTACT_EMAIL   - Email address where you receive messages (e.g. you@example.com)
 *
 * Resend free tier: use "onboarding@resend.dev" as the sender until you verify a domain.
 */

const RESEND_API_URL = 'https://api.resend.com/emails';

function allowCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  allowCors(res);
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !toEmail) {
    console.error('Missing RESEND_API_KEY or CONTACT_EMAIL in Vercel environment variables');
    return res.status(500).json({
      error: 'Contact form not configured. Set RESEND_API_KEY and CONTACT_EMAIL in Vercel.',
    });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { name = '', email = '', message = '', website = '' } = body;
  if (String(website).trim()) {
    return res.status(200).json({ success: true });
  }

  const trimmedName = String(name).trim();
  const trimmedEmail = String(email).trim().toLowerCase();
  const trimmedMessage = String(message).trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return res.status(400).json({
      error: 'Name, email, and message are required.',
    });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const html = `
    <p><strong>From:</strong> ${escapeHtml(trimmedName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(trimmedMessage).replace(/\n/g, '<br>')}</p>
  `;

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [toEmail],
        subject: `Contact from portfolio: ${escapeHtml(trimmedName)}`,
        html,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Resend error:', response.status, data);
      return res.status(502).json({
        error: 'Could not send message. Please try again later.',
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(500).json({
      error: 'Something went wrong. Please try again later.',
    });
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(text).replace(/[&<>"']/g, (c) => map[c]);
}
