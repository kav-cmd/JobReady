import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export interface Skill {
  name: string;
  level: number;
}

export interface Experience {
  jobTitle: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface ResumeData {
  // Personal Information
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;

  // Professional Info
  summary: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  certifications: string[];
}

interface ResumeQuestionnaireProps {
  initialData: ResumeData;
  onSave: (data: ResumeData) => void;
  onClose: () => void;
}

export function ResumeQuestionnaire({
  initialData,
  onSave,
  onClose,
}: ResumeQuestionnaireProps) {
  const [formData, setFormData] = useState<ResumeData>(initialData);
  const [activeSection, setActiveSection] = useState<
    "personal" | "professional" | "skills" | "experience" | "education" | "certifications"
  >("personal");

  const handleInputChange = (field: keyof ResumeData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: "", level: 50 }],
    }));
  };

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { jobTitle: "", company: "", duration: "", description: "" },
      ],
    }));
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", year: "" }],
    }));
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, ""],
    }));
  };

  const updateCertification = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? value : cert
      ),
    }));
  };

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-card rounded-2xl border border-border w-full max-w-2xl shadow-2xl my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card rounded-t-2xl">
          <h2 className="text-2xl font-bold text-foreground">Resume Builder</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Personal Information Section */}
          {activeSection === "personal" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="e.g., Data Analyst, Sales Executive"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="City, State"
                />
              </div>
            </motion.div>
          )}

          {/* Professional Summary Section */}
          {activeSection === "professional" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-foreground">Professional Summary</h3>
              <textarea
                value={formData.summary}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground min-h-32"
                placeholder="Brief overview of your professional background, skills, and career goals..."
              />
              <p className="text-xs text-muted-foreground">
                {formData.summary.length} characters
              </p>
            </motion.div>
          )}

          {/* Skills Section */}
          {activeSection === "skills" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Skills</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addSkill}
                  className="gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </Button>
              </div>
              <div className="space-y-3">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateSkill(index, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        placeholder="Skill name"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) =>
                          updateSkill(index, "level", parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        placeholder="Level"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeSkill(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {formData.skills.length === 0 && (
                <p className="text-sm text-muted-foreground">No skills added yet.</p>
              )}
            </motion.div>
          )}

          {/* Experience Section */}
          {activeSection === "experience" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Work Experience</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addExperience}
                  className="gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </Button>
              </div>
              <div className="space-y-4">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                    <input
                      type="text"
                      value={exp.jobTitle}
                      onChange={(e) => updateExperience(index, "jobTitle", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground font-medium"
                      placeholder="Job Title"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, "company", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      placeholder="Company Name"
                    />
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, "duration", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      placeholder="e.g., Jan 2020 - Dec 2021"
                    />
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, "description", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      placeholder="Describe your responsibilities and achievements"
                      rows={3}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeExperience(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </Button>
                  </div>
                ))}
              </div>
              {formData.experience.length === 0 && (
                <p className="text-sm text-muted-foreground">No experience added yet.</p>
              )}
            </motion.div>
          )}

          {/* Education Section */}
          {activeSection === "education" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Education</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addEducation}
                  className="gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </Button>
              </div>
              <div className="space-y-3">
                {formData.education.map((edu, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground font-medium"
                      placeholder="Degree"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, "institution", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      placeholder="Institution Name"
                    />
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(index, "year", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      placeholder="Graduation Year"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeEducation(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </Button>
                  </div>
                ))}
              </div>
              {formData.education.length === 0 && (
                <p className="text-sm text-muted-foreground">No education added yet.</p>
              )}
            </motion.div>
          )}

          {/* Certifications Section */}
          {activeSection === "certifications" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Certifications</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addCertification}
                  className="gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Certification
                </Button>
              </div>
              <div className="space-y-2">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={cert}
                      onChange={(e) => updateCertification(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      placeholder="Certification name"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCertification(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {formData.certifications.length === 0 && (
                <p className="text-sm text-muted-foreground">No certifications added yet.</p>
              )}
            </motion.div>
          )}
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 p-6 border-t border-border bg-muted/30 rounded-b-2xl">
          {(
            [
              "personal",
              "professional",
              "skills",
              "experience",
              "education",
              "certifications",
            ] as const
          ).map((section) => (
            <Button
              key={section}
              size="sm"
              variant={activeSection === section ? "default" : "outline"}
              onClick={() => setActiveSection(section)}
              className="capitalize"
            >
              {section}
            </Button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-6 border-t border-border justify-end bg-card rounded-b-2xl">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>Save Resume</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
