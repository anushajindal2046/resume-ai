import { Router } from 'express';
import uploadRoutes from './uploadRoutes.js';
import skillRoutes from './skillRoutes.js';
import resumeRoutes from './resumeRoutes.js';
import authRoutes from './authRoutes.js';
import { submitFeedback } from '../controllers/feedbackController.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth
router.use('/auth', authRoutes);

// Feedback (public)
router.post('/feedback', (req, res, next) => {
  submitFeedback(req, res).catch(next);
});

// Resume upload
router.use('/', uploadRoutes);

// Skill extraction
router.use('/', skillRoutes);

// Resume CRUD + report
router.use('/', resumeRoutes);

export default router;
