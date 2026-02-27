import mongoose from 'mongoose';
import { Company } from '../models/index.js';
import { predictCompanyFit } from '../services/predictionService.js';

/**
 * POST /predict-fit
 * Body: { "resumeSkills": ["JavaScript", "React", ...], "companyId": "..." }
 * Returns fit score and analysis for the given company.
 */
export async function predictFit(req, res) {
  const { resumeSkills, companyId } = req.body ?? {};
  const skills = Array.isArray(resumeSkills) ? resumeSkills : [];

  if (!companyId || typeof companyId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'companyId is required and must be a string.',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid companyId format.',
    });
  }

  try {
    const company = await Company.findById(companyId).lean();
    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found.',
      });
    }

    const result = predictCompanyFit(skills, company);

    return res.json({
      fitPercentage: result.fitPercentage,
      breakdown: result.breakdown,
      explanation: result.explanation,
      companyName: company.name,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to compute fit.',
    });
  }
}
