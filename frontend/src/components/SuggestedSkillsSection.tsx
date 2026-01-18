import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { getSuggestedSkills, skillExists, type SuggestedSkill } from "@/lib/courseSkillMapping";
import { useEffect, useState } from "react";

interface SuggestedSkillsProps {
  userId: string | null;
  currentSkills: Array<{ name: string; level: number }>;
  onAddSkill: (skill: SuggestedSkill) => void;
  onAddMultiple: (skills: SuggestedSkill[]) => void;
}

export function SuggestedSkillsSection({
  userId,
  currentSkills,
  onAddSkill,
  onAddMultiple,
}: SuggestedSkillsProps) {
  const [suggestedSkills, setSuggestedSkills] = useState<SuggestedSkill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<SuggestedSkill[]>([]);

  useEffect(() => {
    const suggested = getSuggestedSkills(userId);
    setSuggestedSkills(suggested);

    // Filter to show only skills not already in resume
    const newSkills = suggested.filter(
      (skill) => !skillExists(currentSkills, skill.name)
    );
    setAvailableSkills(newSkills);
  }, [userId, currentSkills]);

  if (suggestedSkills.length === 0) {
    return null;
  }

  const addedSkills = suggestedSkills.filter((skill) =>
    skillExists(currentSkills, skill.name)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border rounded-lg p-6 bg-gradient-to-br from-primary/5 to-accent/5 mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Skills from Your Courses</h3>
          <p className="text-sm text-muted-foreground">
            {availableSkills.length} new skill{availableSkills.length !== 1 ? "s" : ""} ready to add
          </p>
        </div>
      </div>

      {availableSkills.length > 0 && (
        <div className="mb-4">
          <div className="space-y-2 mb-4">
            <AnimatePresence>
              {availableSkills.map((skill) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{skill.name}</p>
                    <p className="text-xs text-muted-foreground">
                      From: {skill.source}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{skill.level}%</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSkill(skill)}
                    className="ml-2 gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {availableSkills.length > 1 && (
            <Button
              onClick={() => onAddMultiple(availableSkills)}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              Add All {availableSkills.length} Skills
            </Button>
          )}
        </div>
      )}

      {addedSkills.length > 0 && (
        <div>
          <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4" />
            {addedSkills.length} skill{addedSkills.length !== 1 ? "s" : ""} added to resume
          </p>
          <div className="space-y-1">
            {addedSkills.map((skill) => (
              <p key={skill.id} className="text-xs text-muted-foreground">
                ✓ {skill.name}
              </p>
            ))}
          </div>
        </div>
      )}

      {availableSkills.length === 0 && addedSkills.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <CheckCircle className="w-4 h-4" />
          All course skills added to your resume!
        </div>
      )}

      {availableSkills.length === 0 && addedSkills.length === 0 && (
        <div className="text-center py-4">
          <AlertCircle className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Complete courses to see skill suggestions
          </p>
        </div>
      )}
    </motion.div>
  );
}
