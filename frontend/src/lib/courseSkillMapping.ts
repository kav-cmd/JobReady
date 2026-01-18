/**
 * Course-to-Skill Mapping Utility
 * Maps completed courses to relevant resume skills
 */

export interface SuggestedSkill {
  id: string;
  name: string;
  level: number;
  source: string; // Course that generated this suggestion
  courseId: string;
}

// Mapping of course IDs to their corresponding skills
const courseToSkillMap: Record<string, { name: string; level: number }> = {
  "course-001": { name: "Microsoft Excel", level: 80 },
  "course-001-word": { name: "Microsoft Word", level: 75 },
  "course-001-ppt": { name: "Microsoft PowerPoint", level: 75 },
  "course-002": { name: "Email Communication", level: 85 },
  "course-003": { name: "Customer Service", level: 80 },
  "course-004": { name: "Data Entry", level: 85 },
  "course-005": { name: "Computer Skills", level: 70 },
  "course-006": { name: "Workplace Safety", level: 75 },
};

// Alternative course-to-skill mapping with more detailed course titles
const courseDetailMapping: Record<string, SuggestedSkill> = {
  "course-001": {
    id: "skill-microsoft-excel",
    name: "Microsoft Excel",
    level: 80,
    source: "Microsoft Skills",
    courseId: "course-001",
  },
  "course-002": {
    id: "skill-email-comm",
    name: "Email Communication",
    level: 85,
    source: "Email Communication Skills",
    courseId: "course-002",
  },
  "course-003": {
    id: "skill-customer-service",
    name: "Customer Service",
    level: 80,
    source: "Customer Service Excellence",
    courseId: "course-003",
  },
  "course-004": {
    id: "skill-data-entry",
    name: "Data Entry & Accuracy",
    level: 85,
    source: "Data Entry & Accuracy",
    courseId: "course-004",
  },
  "course-005": {
    id: "skill-computer",
    name: "Computer Skills",
    level: 70,
    source: "Basic Computer Skills",
    courseId: "course-005",
  },
  "course-006": {
    id: "skill-workplace-safety",
    name: "Workplace Safety & Ethics",
    level: 75,
    source: "Workplace Safety & Ethics",
    courseId: "course-006",
  },
};

/**
 * Get suggested skills based on completed courses
 * @param userId - User ID to fetch progress for
 * @returns Array of suggested skills from completed courses
 */
export function getSuggestedSkills(userId: string | null): SuggestedSkill[] {
  if (!userId) return [];

  try {
    const progressKey = `progress_${userId}`;
    const progressData = localStorage.getItem(progressKey);
    if (!progressData) return [];

    const progress = JSON.parse(progressData);
    const suggestedSkills: SuggestedSkill[] = [];

    // Map completed courses to skills
    Object.entries(progress).forEach(([courseId, courseData]: [string, any]) => {
      if (courseData.status === "completed" && courseDetailMapping[courseId]) {
        suggestedSkills.push(courseDetailMapping[courseId]);
      }
    });

    return suggestedSkills;
  } catch (error) {
    console.error("Error fetching suggested skills:", error);
    return [];
  }
}

/**
 * Check if a skill already exists in the resume
 * @param resumeSkills - Current resume skills
 * @param skillName - Skill name to check
 * @returns true if skill already exists
 */
export function skillExists(
  resumeSkills: Array<{ name: string; level: number }>,
  skillName: string
): boolean {
  return resumeSkills.some((skill) => skill.name.toLowerCase() === skillName.toLowerCase());
}

/**
 * Add suggested skill to resume
 * @param resumeSkills - Current resume skills array
 * @param suggestedSkill - Skill to add
 * @returns Updated skills array
 */
export function addSkillToResume(
  resumeSkills: Array<{ name: string; level: number }>,
  suggestedSkill: SuggestedSkill
): Array<{ name: string; level: number }> {
  if (!skillExists(resumeSkills, suggestedSkill.name)) {
    return [
      ...resumeSkills,
      {
        name: suggestedSkill.name,
        level: suggestedSkill.level,
      },
    ];
  }
  return resumeSkills;
}

/**
 * Add multiple suggested skills to resume
 * @param resumeSkills - Current resume skills array
 * @param suggestedSkills - Skills to add
 * @returns Updated skills array
 */
export function addMultipleSkillsToResume(
  resumeSkills: Array<{ name: string; level: number }>,
  suggestedSkills: SuggestedSkill[]
): Array<{ name: string; level: number }> {
  let updatedSkills = [...resumeSkills];
  suggestedSkills.forEach((skill) => {
    updatedSkills = addSkillToResume(updatedSkills, skill);
  });
  return updatedSkills;
}
