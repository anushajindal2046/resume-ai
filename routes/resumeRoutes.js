import { Router } from 'express';
import { listResumes, getResumeById, getReport } from '../controllers/resumeController.js';
import { requireAuth } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/resumes', requireAuth, (req, res, next) => {
  listResumes(req, res).catch(next);
});

router.get('/resumes/:id', optionalAuth, (req, res, next) => {
  getResumeById(req, res).catch(next);
});

router.get('/resumes/:id/report', optionalAuth, (req, res, next) => {
  getReport(req, res).catch(next);
});

export default router;
