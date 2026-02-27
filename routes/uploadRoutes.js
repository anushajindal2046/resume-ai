import { Router } from 'express';
import { uploadResume as uploadResumeMiddleware } from '../config/multer.js';
import { uploadResume } from '../controllers/uploadController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/upload-resume', optionalAuth, (req, res, next) => {
  uploadResumeMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    try {
      await uploadResume(req, res, next);
    } catch (e) {
      next(e);
    }
  });
});

export default router;
