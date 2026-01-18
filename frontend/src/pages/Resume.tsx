import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Edit,
  Layout,
  AlertCircle,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ResumeQuestionnaire, type ResumeData } from "@/components/ResumeQuestionnaire";
import { ModernTemplate, MinimalTemplate, CreativeTemplate } from "@/components/ResumeTemplates";
import { SavedResumesSection } from "@/components/SavedResumesSection";
import { SuggestedSkillsSection } from "@/components/SuggestedSkillsSection";
import {
  generateResumePDF,
  saveResumeMetadata,
  type SavedResume,
} from "@/lib/resumePdfUtils";
import {
  addSkillToResume,
  addMultipleSkillsToResume,
  type SuggestedSkill,
} from "@/lib/courseSkillMapping";

export default function Resume() {
  const { toast } = useToast();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "minimal" | "creative">("modern");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    skills: [],
    experience: [],
    education: [],
    certifications: [],
  });

  // Load resume data from localStorage on component mount
  useEffect(() => {
    try {
      const userDataString = localStorage.getItem("user");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const id = userData._id || userData.id;
        setUserId(id);
      }
      
      const savedResume = localStorage.getItem("resumeData");
      if (savedResume) {
        setResumeData(JSON.parse(savedResume));
      } else {
        // Load from user profile if no resume exists
        loadFromUserProfile();
      }
    } catch (error) {
      console.error("Error loading resume data:", error);
      loadFromUserProfile();
    }
  }, []);

  const loadFromUserProfile = () => {
    try {
      const userDataString = localStorage.getItem("user");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const userId = userData._id || userData.id;
        const userProgress = localStorage.getItem(`progress_${userId}`);
        const progressData = userProgress ? JSON.parse(userProgress) : {};

        // Calculate skills from completed courses
        const skillsMap = new Map<string, number>();
        const courseToSkill: Record<string, string> = {
          "course-001": "Microsoft Excel",
          "course-002": "Email Communication",
          "course-003": "Customer Service",
          "course-004": "Data Entry",
          "course-005": "Computer Skills",
          "course-006": "Workplace Safety",
        };

        Object.entries(progressData).forEach(([courseId, progress]: [string, any]) => {
          const skillName = courseToSkill[courseId];
          if (skillName && progress.status) {
            const proficiencyMap: Record<string, number> = {
              "not-started": 0,
              "in-progress": 50,
              "completed": 90,
            };
            skillsMap.set(skillName, proficiencyMap[progress.status] || 0);
          }
        });

        const skills = Array.from(skillsMap, ([name, level]) => ({ name, level }));

        setResumeData({
          name: userData.name || "",
          title: userData.jobTitle || "",
          email: userData.email || "",
          phone: userData.phone || "",
          location: userData.location || "",
          summary: userData.professionalSummary || "",
          skills: skills,
          experience: [],
          education: [],
          certifications: skills.length > 0 ? skills.map(s => `${s.name} - JobReady`) : [],
        });
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const handleSaveResume = (data: ResumeData) => {
    setResumeData(data);
    localStorage.setItem("resumeData", JSON.stringify(data));
    setShowQuestionnaire(false);
    toast({
      title: "Resume Saved!",
      description: "Your resume has been updated successfully.",
    });
  };

  const handleDownloadPDF = async () => {
    // Validate data
    if (!resumeData.name || !resumeData.email) {
      toast({
        title: "Missing Information",
        description: "Please add at least your name and email before downloading.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      // Generate PDF from resume preview
      const pdfBlob = await generateResumePDF("resume-preview", `${resumeData.name}_Resume`);

      // Create resume metadata
      const savedResume: SavedResume = {
        id: `resume_${Date.now()}`,
        name: `${resumeData.name}'s Resume`,
        template: selectedTemplate,
        timestamp: Date.now(),
        dateCreated: new Date().toLocaleDateString(),
        fileSize: pdfBlob.size,
        pdfBlob: pdfBlob,
      };

      // Save to localStorage
      saveResumeMetadata(savedResume);

      setIsGeneratingPDF(false);
      setShowDownloadConfirm(false);

      toast({
        title: "Resume Saved Successfully! 🎉",
        description: "Your resume has been saved to 'My Resumes' section.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsGeneratingPDF(false);
      toast({
        title: "Error",
        description: "Failed to generate resume PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddSuggestedSkill = (skill: SuggestedSkill) => {
    const updatedSkills = addSkillToResume(resumeData.skills, skill);
    const updatedResumeData = { ...resumeData, skills: updatedSkills };
    setResumeData(updatedResumeData);
    localStorage.setItem("resumeData", JSON.stringify(updatedResumeData));
    toast({
      title: "Skill Added! ✨",
      description: `${skill.name} has been added to your resume.`,
    });
  };

  const handleAddMultipleSuggestedSkills = (skills: SuggestedSkill[]) => {
    const updatedSkills = addMultipleSkillsToResume(resumeData.skills, skills);
    const updatedResumeData = { ...resumeData, skills: updatedSkills };
    setResumeData(updatedResumeData);
    localStorage.setItem("resumeData", JSON.stringify(updatedResumeData));
    toast({
      title: "Skills Added! ✨",
      description: `${skills.length} skill${skills.length !== 1 ? "s" : ""} have been added to your resume.`,
    });
  };

  const templateComponents = {
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    creative: CreativeTemplate,
  };

  const SelectedTemplate = templateComponents[selectedTemplate];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              Resume Builder
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your professional resume with multiple templates
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowQuestionnaire(true)}
            >
              <Edit className="w-4 h-4" />
              Edit Resume
            </Button>
            <Button 
              size="sm" 
              className="gap-2" 
              onClick={() => setShowDownloadConfirm(true)}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Save Resume
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Template Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-4 bg-card border border-border rounded-lg"
        >
          <div className="flex items-center gap-2 mb-3">
            <Layout className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Choose Template</h2>
          </div>
          <div className="flex gap-3 flex-wrap">
            {(["modern", "minimal", "creative"] as const).map((template) => (
              <Button
                key={template}
                variant={selectedTemplate === template ? "default" : "outline"}
                onClick={() => setSelectedTemplate(template)}
                className="capitalize"
              >
                {template} Template
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Suggested Skills from Completed Courses */}
        <SuggestedSkillsSection
          userId={userId}
          currentSkills={resumeData.skills}
          onAddSkill={handleAddSuggestedSkill}
          onAddMultiple={handleAddMultipleSuggestedSkills}
        />

        {/* Resume Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-border rounded-lg overflow-hidden shadow-lg bg-white"
          id="resume-preview"
        >
          <div className="overflow-auto max-h-[calc(100vh-300px)]">
            <SelectedTemplate data={resumeData} />
          </div>
        </motion.div>

        {/* Saved Resumes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <SavedResumesSection />
        </motion.div>

        {/* Empty State */}
        {!resumeData.name && !resumeData.email && (
          <div className="mt-8 p-8 text-center bg-card border border-border rounded-lg">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Resume Data</h3>
            <p className="text-muted-foreground mb-4">
              Get started by filling in your information and build your professional resume.
            </p>
            <Button onClick={() => setShowQuestionnaire(true)}>
              Start Building Resume
            </Button>
          </div>
        )}
      </div>

      {/* Resume Questionnaire Modal */}
      <AnimatePresence>
        {showQuestionnaire && (
          <ResumeQuestionnaire
            initialData={resumeData}
            onSave={handleSaveResume}
            onClose={() => setShowQuestionnaire(false)}
          />
        )}
      </AnimatePresence>

      {/* Download Confirmation Modal */}
      <AnimatePresence>
        {showDownloadConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDownloadConfirm(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 z-50 flex items-center justify-center"
            >
              <div className="bg-card rounded-xl border border-border p-6 max-w-sm w-full shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Save Resume?</h3>
                </div>

                <p className="text-muted-foreground mb-6">
                  Your resume will be saved with the current template and you can access it anytime from the "My Resumes" section.
                </p>

                <div className="space-y-3 mb-6 p-3 bg-muted/30 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Template:</span>
                    <span className="font-medium text-foreground capitalize">{selectedTemplate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Resume Name:</span>
                    <span className="font-medium text-foreground">{resumeData.name}'s Resume</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDownloadConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="flex-1 gap-2"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Save Resume
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
