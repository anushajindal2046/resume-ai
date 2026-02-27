import { getFileMetadata } from '../services/uploadService.js';
import { extractTextFromResume } from '../services/parseService.js';
import { analyzeResume } from '../services/analysisService.js';
import { Resume } from '../models/index.js';

/**
 * POST /upload-resume
 * Expects multipart/form-data: "resume" (file), optional "jobDescription" (text).
 * If Authorization header present, saves analysis to user's history.
 * Returns analysis + optional saved resume id.
 */
export async function uploadResume(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded. Send a file using the "resume" field (PDF or DOCX).',
    });
  }

  const jobDescription = req.body?.jobDescription ?? '';

  try {
    const metadata = getFileMetadata(req.file);
    const { text } = await extractTextFromResume(req.file.buffer, req.file.mimetype);
    const analysis = analyzeResume(text, jobDescription);

    const payload = {
      success: true,
      message: 'Resume uploaded and parsed successfully',
      file: metadata,
      extractedText: text,
      matchedSkills: analysis.skills,
      missingSkills: analysis.missingSkills,
      missingForJob: analysis.missingForJob || [],
      score: analysis.score,
      scoringBreakdown: analysis.breakdown,
    };

    if (req.user && req.user._id) {
      try {
        const resume = await Resume.create({
          userId: req.user._id,
          fileName: metadata.originalName,
          extractedSkills: analysis.skills,
          score: analysis.score,
          missingSkills: analysis.missingSkills,
          missingForJob: analysis.missingForJob || [],
          scoringBreakdown: analysis.breakdown,
          fitResults: [],
        });
        payload.resumeId = resume._id.toString();
        payload.saved = true;
      } catch (dbErr) {
        payload.saved = false;
      }
    }

    return res.status(201).json(payload);
  } catch (err) {
    return res.status(422).json({
      success: false,
      error: err.message || 'Failed to parse resume',
    });
  }
}
