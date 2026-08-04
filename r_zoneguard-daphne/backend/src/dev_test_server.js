const express = require('express');
const bodyParser = require('express').json;
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

let authController;
const { verifyToken, requireRole } = require('./middleware/authMiddleware');
const { sendMail } = require('./utils/mailer');

const app = express();
app.use(cors());
app.use(bodyParser());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'zoneguard-dev-test',
  });
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

app.post('/auth/login', async (req, res) => {
  try {
    if (!authController) authController = require('./controllers/authController');
    return authController.login(req, res);
  } catch (err) {
    console.error('Failed to load authController:', err.message || err);
    return res.status(500).json({ message: 'Authentication not available (DB client error)' });
  }
});

app.post('/test-email', async (req, res) => {
  try {
    const { to, subject, message } = req.body || {};

    if (!to || !message) {
      return res.status(400).json({ message: 'Recipient and message are required' });
    }

    const emailSubject = subject || 'ZoneGuard test email';
    await sendMail({
      to,
      subject: emailSubject,
      text: message,
      html: `<p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>`,
    });

    return res.json({
      message: 'Test email sent',
      to,
      subject: emailSubject,
    });
  } catch (err) {
    console.error('Failed to send test email:', err);
    return res.status(500).json({
      message: 'Unable to send test email',
      error: err.message || 'Unknown error',
    });
  }
});

app.get('/admin-only', verifyToken, requireRole(['ADMIN']), (req, res) => {
  res.json({ message: `Hello ${req.user.user_id}, you are an ADMIN` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Dev test server running on http://localhost:${PORT}`));
