/**
 * POST /feedback
 * Store feedback (in production: save to DB or send email).
 */
export async function submitFeedback(req, res) {
  const { name, email, message } = req.body ?? {};
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Message is required.' });
  }
  try {
    // In production: save to Feedback model or send via email service
    console.log('Feedback:', { name: name || '', email: email || '', message: message.trim() });
    res.status(201).json({ success: true, message: 'Thank you for your feedback.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to submit feedback.' });
  }
}
