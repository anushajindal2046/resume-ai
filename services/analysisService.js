import { extractSkills, getSkillsDatabase } from './skillExtractionService.js';
import { scoreResume } from './scoringService.js';

/**
 * Run full resume analysis: extract skills, score, and list missing skills.
 * If jobDescription is provided, also returns skills the job wants that the resume lacks (missingForJob).
 *
 * @param {string} resumeText - Raw resume text
 * @param {string} [jobDescription] - Optional job description for target-job comparison
 * @returns {{ score: number, skills: string[], missingSkills: string[], missingForJob: string[], breakdown: object }}
 */
export function analyzeResume(resumeText, jobDescription = '') {
  const text = typeof resumeText === 'string' ? resumeText : '';
  const jobText = typeof jobDescription === 'string' ? jobDescription : '';
  const skills = extractSkills(text);
  const { score, breakdown } = scoreResume(skills);
  const allSkills = getSkillsDatabase();
  const matchedSet = new Set(skills);
  const missingSkills = allSkills.filter((s) => !matchedSet.has(s));

  let missingForJob = [];
  if (jobText.trim()) {
    const jobSkills = extractSkills(jobText);
    missingForJob = jobSkills.filter((s) => !matchedSet.has(s));
  }

  return {
    score,
    skills,
    missingSkills,
    missingForJob,
    breakdown,
  };
}
