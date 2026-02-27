import mongoose from 'mongoose';
import { Resume } from '../models/index.js';

/**
 * GET /resumes
 * List resumes for the authenticated user (newest first).
 */
export async function listResumes(req, res) {
  try {
    const list = await Resume.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('fileName score createdAt _id')
      .lean();
    res.json({ resumes: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to list resumes.' });
  }
}

/**
 * GET /resumes/:id
 * Returns a single resume by ID (owner only if auth required).
 */
export async function getResumeById(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: 'Invalid resume ID.' });
  }

  try {
    const resume = await Resume.findById(id).lean();
    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found.' });
    }
    if (req.user && resume.userId && resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }
    res.json(resume);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch resume.' });
  }
}

/**
 * GET /resumes/:id/report
 * Returns HTML report for download (or PDF if we add a generator).
 */
export async function getReport(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: 'Invalid resume ID.' });
  }
  try {
    const resume = await Resume.findById(id).lean();
    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found.' });
    }
    if (req.user && resume.userId && resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }

    const html = buildReportHtml(resume);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="resume-report-${id}.html"`);
    res.send(html);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to generate report.' });
  }
}

function buildReportHtml(resume) {
  const skills = (resume.extractedSkills || []).join(', ');
  const missing = (resume.missingSkills || []).join(', ');
  const missingForJob = (resume.missingForJob || []).join(', ');
  const date = resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : '';
  const breakdown = resume.scoringBreakdown || {};
  const core = breakdown.core || {};
  const tools = breakdown.tools || {};
  const soft = breakdown.soft || {};

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Resume Analysis Report</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 700px; margin: 2rem auto; padding: 0 1rem; color: #1e293b; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .meta { color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem; }
    section { margin-bottom: 1.5rem; }
    h2 { font-size: 1rem; margin-bottom: 0.5rem; color: #475569; }
    .score { font-size: 2rem; font-weight: 700; color: #2563eb; }
    .tag { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem 0.25rem 0 0; font-size: 0.875rem; }
    .missing { background: #ffedd5; color: #9a3412; }
    ul { margin: 0; padding-left: 1.25rem; }
  </style>
</head>
<body>
  <h1>Resume Analysis Report</h1>
  <p class="meta">${resume.fileName || 'Resume'} · Generated ${date}</p>
  <section>
    <h2>ATS Score</h2>
    <p class="score">${resume.score ?? 0} / 100</p>
  </section>
  <section>
    <h2>Score Breakdown</h2>
    <p>Core: ${core.points ?? 0} / ${core.maxPoints ?? 50} · Tools: ${tools.points ?? 0} / ${tools.maxPoints ?? 30} · Soft: ${soft.points ?? 0} / ${soft.maxPoints ?? 20}</p>
  </section>
  <section>
    <h2>Keywords Found</h2>
    <p>${skills || 'None detected.'}</p>
  </section>
  <section>
    <h2>Missing Skills (from database)</h2>
    <p>${missing || 'None.'}</p>
  </section>
  ${missingForJob ? `<section><h2>Missing for Target Job</h2><p>${missingForJob}</p></section>` : ''}
  <p class="meta" style="margin-top: 2rem;">Resume AI · Save this page as PDF from your browser (Print → Save as PDF) for a PDF report.</p>
</body>
</html>`;
}
