import {
  getSkillCategory,
  WEIGHTS,
  MAX_POINTS_PER_CATEGORY,
} from '../config/skillCategories.js';

/**
 * Compute weighted resume score from a list of matched skills.
 * Weights: Core 5, Tools 3, Soft 2. Score is 0–100 with a per-category cap.
 *
 * @param {string[]} matchedSkills - List of skill names (e.g. from extractSkills)
 * @returns {{ score: number, breakdown: object }}
 */
export function scoreResume(matchedSkills) {
  if (!Array.isArray(matchedSkills)) {
    return { score: 0, breakdown: getEmptyBreakdown() };
  }

  const core = [];
  const tools = [];
  const soft = [];
  const uncategorized = [];

  for (const skill of matchedSkills) {
    const category = getSkillCategory(skill);
    if (category === 'core') core.push(skill);
    else if (category === 'tools') tools.push(skill);
    else if (category === 'soft') soft.push(skill);
    else if (skill) uncategorized.push(skill);
  }

  const corePoints = Math.min(
    MAX_POINTS_PER_CATEGORY.core,
    core.length * WEIGHTS.core
  );
  const toolsPoints = Math.min(
    MAX_POINTS_PER_CATEGORY.tools,
    tools.length * WEIGHTS.tools
  );
  const softPoints = Math.min(
    MAX_POINTS_PER_CATEGORY.soft,
    soft.length * WEIGHTS.soft
  );

  const totalScore = Math.min(100, Math.round(corePoints + toolsPoints + softPoints));

  const breakdown = {
    core: {
      skills: core,
      count: core.length,
      weight: WEIGHTS.core,
      points: corePoints,
      maxPoints: MAX_POINTS_PER_CATEGORY.core,
    },
    tools: {
      skills: tools,
      count: tools.length,
      weight: WEIGHTS.tools,
      points: toolsPoints,
      maxPoints: MAX_POINTS_PER_CATEGORY.tools,
    },
    soft: {
      skills: soft,
      count: soft.length,
      weight: WEIGHTS.soft,
      points: softPoints,
      maxPoints: MAX_POINTS_PER_CATEGORY.soft,
    },
    uncategorized: uncategorized.length ? { skills: uncategorized, count: uncategorized.length } : undefined,
  };

  if (!breakdown.uncategorized) delete breakdown.uncategorized;

  return {
    score: totalScore,
    breakdown,
  };
}

function getEmptyBreakdown() {
  return {
    core: { skills: [], count: 0, weight: WEIGHTS.core, points: 0, maxPoints: MAX_POINTS_PER_CATEGORY.core },
    tools: { skills: [], count: 0, weight: WEIGHTS.tools, points: 0, maxPoints: MAX_POINTS_PER_CATEGORY.tools },
    soft: { skills: [], count: 0, weight: WEIGHTS.soft, points: 0, maxPoints: MAX_POINTS_PER_CATEGORY.soft },
  };
}
