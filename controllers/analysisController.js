import mongoose from 'mongoose';
import { Resume } from '../models/index.js';
import { analyzeResume } from '../services/analysisService.js';

/**
 * POST /analyze-resume
 * Body: { "text": "resume text...", "userId": "507f1f77bcf86cd799439011" }
 * Runs analysis, saves results to MongoDB, returns the stored document.
 */
export async function analyzeResumeAndSave(req, res) {
  const { text, userId } = req.body ?? {};
  const resumeText = typeof text === 'string' ? text : '';

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'userId is required to save analysis results.',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid userId format.',
    });
  }

  try {
    const analysis = analyzeResume(resumeText);

    const resume = await Resume.create({
      userId,
      extractedSkills: analysis.skills,
      score: analysis.score,
      missingSkills: analysis.missingSkills,
      scoringBreakdown: analysis.breakdown,
      fitResults: [],
    });

    const stored = resume.toObject();
    return res.status(201).json(stored);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to analyze and save resume.',
    });
  }
}
