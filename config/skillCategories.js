/**
 * Skill categories for weighted scoring.
 * Core Skills → 5, Tools → 3, Soft Skills → 2.
 */
const CORE_SKILLS = new Set([
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Ruby', 'Go',
  'Rust', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'SQL', 'HTML', 'CSS',
  'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask',
  'Spring Boot', 'Ruby on Rails', '.NET', 'jQuery', 'Bootstrap', 'Tailwind CSS',
  'Next.js', 'Nuxt.js', 'Svelte',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Firebase', 'DynamoDB',
  'REST API', 'GraphQL',
  'Machine Learning', 'Data Analysis', 'Data Visualization', 'Unit Testing',
]);

const TOOLS_SKILLS = new Set([
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Git', 'Jenkins', 'Terraform',
  'Linux', 'Agile', 'Scrum', 'Jira', 'GitHub', 'GitLab', 'Figma', 'Postman',
  'Tableau', 'Power BI', 'Excel',
]);

const SOFT_SKILLS = new Set([
  'Leadership', 'Communication', 'Problem Solving', 'Team Collaboration',
  'Project Management', 'Technical Writing', 'Mentoring',
]);

export const WEIGHTS = {
  core: 5,
  tools: 3,
  soft: 2,
};

/** Max points per category so total score caps at 100 (50 + 30 + 20). */
export const MAX_POINTS_PER_CATEGORY = {
  core: 50,  // e.g. 10 skills × 5
  tools: 30, // e.g. 10 skills × 3
  soft: 20,  // e.g. 10 skills × 2
};

export function getSkillCategory(skillName) {
  if (CORE_SKILLS.has(skillName)) return 'core';
  if (TOOLS_SKILLS.has(skillName)) return 'tools';
  if (SOFT_SKILLS.has(skillName)) return 'soft';
  return null;
}

export { CORE_SKILLS, TOOLS_SKILLS, SOFT_SKILLS };
