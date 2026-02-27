import { Router } from 'express';
import { extractSkills } from '../services/skillExtractionService.js';
import { scoreResume } from '../services/scoringService.js';
import { analyzeResume } from '../services/analysisService.js';
import { predictFit } from '../controllers/predictionController.js';
import { analyzeResumeAndSave } from '../controllers/analysisController.js';

const router = Router();

/**
 * POST /predict-fit
 * Body: { "resumeSkills": ["JavaScript", "React", ...], "companyId": "507f1f77bcf86cd799439011" }
 * Returns fit score (fitPercentage) and analysis (breakdown, explanation, companyName).
 */
router.post('/predict-fit', (req, res, next) => {
  predictFit(req, res).catch(next);
});

/**
 * POST /analyze-resume
 * Body: { "text": "resume text...", "userId": "507f1f77bcf86cd799439011" }
 * Runs analysis, saves results to MongoDB, returns the stored Resume document.
 */
router.post('/analyze-resume', (req, res, next) => {
  analyzeResumeAndSave(req, res).catch(next);
});

/**
 * POST /extract-skills
 * Body: { "text": "resume or job description text..." }
 * Returns matched skills from the predefined skills database (case-insensitive).
 */
router.post('/extract-skills', (req, res) => {
  const text = req.body?.text ?? '';
  const matchedSkills = extractSkills(text);
  res.json({ matchedSkills });
});

/**
 * POST /score-resume
 * Body: { "matchedSkills": ["JavaScript", "React", ...] }
 * Returns weighted score (0–100) and scoring breakdown (core/tools/soft).
 */
router.post('/score-resume', (req, res) => {
  const matchedSkills = req.body?.matchedSkills ?? [];
  const result = scoreResume(matchedSkills);
  res.json(result);
});

export default router;
