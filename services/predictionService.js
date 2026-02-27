import { getSkillCategory } from '../config/skillCategories.js';
import { WEIGHTS } from '../config/skillCategories.js';

const DEFAULT_WEIGHTS = { core: 5, tools: 3, soft: 2 };

/**
 * Get the weight for a skill based on its category and company/default weights.
 * @param {string} skillName
 * @param {{ core: number, tools: number, soft: number }} weights
 * @returns {number}
 */
function getWeightForSkill(skillName, weights = DEFAULT_WEIGHTS) {
  const category = getSkillCategory(skillName);
  if (category === 'core') return weights.core ?? DEFAULT_WEIGHTS.core;
  if (category === 'tools') return weights.tools ?? DEFAULT_WEIGHTS.tools;
  if (category === 'soft') return weights.soft ?? DEFAULT_WEIGHTS.soft;
  return DEFAULT_WEIGHTS.core; // uncategorized treated as core
}

/**
 * Compare resume skills to company preferred skills and compute fit.
 * Uses weighted similarity: each preferred skill has a weight (by category); fit = (matched weighted sum / total preferred weighted sum) * 100.
 *
 * @param {string[]} resumeSkills - Skills extracted from the resume
 * @param {{ preferredSkills: string[], weights?: { core?: number, tools?: number, soft?: number } }} company - Company doc or plain object
 * @returns {{ fitPercentage: number, breakdown: object, explanation: object }}
 */
export function predictCompanyFit(resumeSkills, company) {
  const preferred = company?.preferredSkills ?? [];
  const weights = {
    core: company?.weights?.core ?? DEFAULT_WEIGHTS.core,
    tools: company?.weights?.tools ?? DEFAULT_WEIGHTS.tools,
    soft: company?.weights?.soft ?? DEFAULT_WEIGHTS.soft,
  };

  const resumeList = Array.isArray(resumeSkills) ? resumeSkills.map((s) => String(s).trim()) : [];
  const resumeSetLower = new Set(resumeList.map((s) => s.toLowerCase()));

  const matched = [];
  const missing = [];
  const categoryData = { core: { matched: [], missing: [], points: 0, maxPoints: 0 }, tools: { matched: [], missing: [], points: 0, maxPoints: 0 }, soft: { matched: [], missing: [], points: 0, maxPoints: 0 } };

  for (const skill of preferred) {
    const s = String(skill).trim();
    if (!s) continue;
    const category = getSkillCategory(s) || 'core';
    const weight = getWeightForSkill(s, weights);
    const key = category in categoryData ? category : 'core';

    if (resumeSetLower.has(s.toLowerCase())) {
      matched.push(s);
      categoryData[key].matched.push(s);
      categoryData[key].points += weight;
    } else {
      missing.push(s);
      categoryData[key].missing.push(s);
    }
    categoryData[key].maxPoints += weight;
  }

  let totalPoints = 0;
  let totalMaxPoints = 0;
  for (const key of ['core', 'tools', 'soft']) {
    totalPoints += categoryData[key].points;
    totalMaxPoints += categoryData[key].maxPoints;
  }

  const fitPercentage =
    totalMaxPoints > 0
      ? Math.min(100, Math.max(0, Math.round((totalPoints / totalMaxPoints) * 100)))
      : 100;

  const breakdown = {
    matchedSkills: matched,
    missingSkills: missing,
    byCategory: {
      core: {
        matched: categoryData.core.matched,
        missing: categoryData.core.missing,
        points: categoryData.core.points,
        maxPoints: categoryData.core.maxPoints,
        weight: weights.core,
      },
      tools: {
        matched: categoryData.tools.matched,
        missing: categoryData.tools.missing,
        points: categoryData.tools.points,
        maxPoints: categoryData.tools.maxPoints,
        weight: weights.tools,
      },
      soft: {
        matched: categoryData.soft.matched,
        missing: categoryData.soft.missing,
        points: categoryData.soft.points,
        maxPoints: categoryData.soft.maxPoints,
        weight: weights.soft,
      },
    },
    totalPreferred: preferred.length,
    totalMatched: matched.length,
    weightedPoints: totalPoints,
    weightedMax: totalMaxPoints,
  };

  const explanation = {
    summary: totalMaxPoints > 0
      ? `Candidate has ${matched.length} of ${preferred.length} preferred skills (${fitPercentage}% weighted fit).`
      : 'No preferred skills defined; fit set to 100%.',
    matchedCount: matched.length,
    missingCount: missing.length,
    preferredCount: preferred.length,
  };

  return {
    fitPercentage,
    breakdown,
    explanation,
  };
}
