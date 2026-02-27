import { SKILLS_DATABASE } from '../config/skills.js';

/**
 * Extract skills from text by matching against the predefined skills database.
 * Matching is case-insensitive and returns unique skills in database order.
 *
 * @param {string} text - Raw text to search (e.g. resume extracted text)
 * @returns {string[]} Matched skills (unique, case as in database)
 */
export function extractSkills(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const normalizedText = text.toLowerCase();
  const matched = new Set();

  for (const skill of SKILLS_DATABASE) {
    const normalizedSkill = skill.toLowerCase();
    if (normalizedText.includes(normalizedSkill)) {
      matched.add(skill);
    }
  }

  return [...matched];
}

/**
 * Get the full skills database (read-only reference).
 * @returns {readonly string[]}
 */
export function getSkillsDatabase() {
  return SKILLS_DATABASE;
}
