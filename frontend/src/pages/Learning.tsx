import { DashboardLayout } from "@/components/DashboardLayout";
import { ModuleCard } from "@/components/ModuleCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Filter, Play, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { VideoCompletionCheckbox } from "@/components/VideoCompletionButton";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Course data with YouTube URLs
// Backend-ready structure: userId will be added from auth context
interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  status: "locked" | "not-started" | "in-progress" | "completed";
  thumbnail: string;
  youtubeUrl?: string;
}

// Video data for Microsoft Skills
interface VideoData {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
  tool: "Excel" | "Word" | "PowerPoint" | "English" | "CustomerService" | "Interview";
}

// Beginner level videos
const beginnerVideos: VideoData[] = [
  {
    id: "excel-beginner",
    title: "MS Excel for Beginners",
    youtubeId: "wbJcJCkBcMg",
    duration: "1:15:00",
    tool: "Excel",
  },
  {
    id: "word-beginner",
    title: "MS Word Essentials",
    youtubeId: "2MCmnr2L50o",
    duration: "45:30",
    tool: "Word",
  },
  {
    id: "ppt-beginner",
    title: "MS PowerPoint Basics",
    youtubeId: "KqgyvGxISxk",
    duration: "1:05:00",
    tool: "PowerPoint",
  },
];

// Intermediate level videos
const intermediateVideos: VideoData[] = [
  {
    id: "excel-intermediate",
    title: "Excel Formulas & Functions",
    youtubeId: "BkvVvbqe2q4",
    duration: "2:30:00",
    tool: "Excel",
  },
  {
    id: "word-intermediate",
    title: "Advanced Word Formatting",
    youtubeId: "lsX0CjHSJ5Y",
    duration: "1:20:00",
    tool: "Word",
  },
  {
    id: "ppt-intermediate",
    title: "Professional PowerPoint Design",
    youtubeId: "vhdwi-L7suI",
    duration: "1:45:00",
    tool: "PowerPoint",
  },
];

// Advanced level videos
const advancedVideos: VideoData[] = [
  {
    id: "excel-advanced",
    title: "Excel Data Analysis & Pivot Tables",
    youtubeId: "PlPgYOFJROI",
    duration: "3:15:00",
    tool: "Excel",
  },
  {
    id: "word-advanced",
    title: "Word: Mail Merge & Macros",
    youtubeId: "TXBuw25w9Z0",
    duration: "2:00:00",
    tool: "Word",
  },
  {
    id: "ppt-advanced",
    title: "PowerPoint Animation & Interactivity",
    youtubeId: "lxcHLxjkcXQ",
    duration: "2:15:00",
    tool: "PowerPoint",
  },
];

// Email Communication Skills videos
const emailCommunicationVideos: VideoData[] = [
  {
    id: "email-part-1",
    title: "Email Communication - Part 1",
    youtubeId: "3vEinLMawYw",
    duration: "Variable",
    tool: "Word", // Using Word as placeholder for tool type
  },
  {
    id: "email-part-2",
    title: "Email Communication - Part 2",
    youtubeId: "D_EZRIHjg0I",
    duration: "Variable",
    tool: "Word",
  },
  {
    id: "email-part-3",
    title: "Email Communication - Part 3",
    youtubeId: "B_ntXJZxgf4",
    duration: "Variable",
    tool: "Word",
  },
  {
    id: "email-part-4",
    title: "Email Communication - Part 4",
    youtubeId: "1KWh6uE5nYk",
    duration: "Variable",
    tool: "Word",
  },
  {
    id: "email-part-5",
    title: "Email Communication - Part 5",
    youtubeId: "TArF_dnhT60",
    duration: "Variable",
    tool: "Word",
  },
  {
    id: "email-part-6",
    title: "Email Communication - Part 6",
    youtubeId: "CDAi8_Dn3mI",
    duration: "Variable",
    tool: "Word",
  },
];

// English Speaking videos
const englishSpeakingVideos: VideoData[] = [
  { id: "english-part-1", title: "English Speaking - Part 1", youtubeId: "hg8zhdOLRNg", duration: "Variable", tool: "English" },
  { id: "english-part-2", title: "English Speaking - Part 2", youtubeId: "ePMSZ98VwFI", duration: "Variable", tool: "English" },
  { id: "english-part-3", title: "English Speaking - Part 3", youtubeId: "8pDc3Sy3d_k", duration: "Variable", tool: "English" },
  { id: "english-part-4", title: "English Speaking - Part 4", youtubeId: "E8rpVPDAopQ", duration: "Variable", tool: "English" },
  { id: "english-part-5", title: "English Speaking - Part 5", youtubeId: "2oWsa6eh9tE", duration: "Variable", tool: "English" },
  { id: "english-part-6", title: "English Speaking - Part 6", youtubeId: "KKY9trUP-WY", duration: "Variable", tool: "English" },
  { id: "english-part-7", title: "English Speaking - Part 7", youtubeId: "98RdCujk33w", duration: "Variable", tool: "English" },
  { id: "english-part-8", title: "English Speaking - Part 8", youtubeId: "lItJ5Hj3qoA", duration: "Variable", tool: "English" },
  { id: "english-part-9", title: "English Speaking - Part 9", youtubeId: "RdKm5gL9Iqg", duration: "Variable", tool: "English" },
  { id: "english-part-10", title: "English Speaking - Part 10", youtubeId: "2G4Xn08DNyY", duration: "Variable", tool: "English" },
  { id: "english-part-11", title: "English Speaking - Part 11", youtubeId: "DaBm_qnYA-I", duration: "Variable", tool: "English" },
  { id: "english-part-12", title: "English Speaking - Part 12", youtubeId: "pjEd9xUFgDM", duration: "Variable", tool: "English" },
  { id: "english-part-13", title: "English Speaking - Part 13", youtubeId: "0FamBoKefcA", duration: "Variable", tool: "English" },
  { id: "english-part-14", title: "English Speaking - Part 14", youtubeId: "spxJCogI8VQ", duration: "Variable", tool: "English" },
  { id: "english-part-15", title: "English Speaking - Part 15", youtubeId: "XZI4kqcOV-U", duration: "Variable", tool: "English" },
  { id: "english-part-16", title: "English Speaking - Part 16", youtubeId: "R5sV3DTcQQM", duration: "Variable", tool: "English" },
  { id: "english-part-17", title: "English Speaking - Part 17", youtubeId: "ssMjPDnNhj0", duration: "Variable", tool: "English" },
  { id: "english-part-18", title: "English Speaking - Part 18", youtubeId: "c94QqTF_Cnw", duration: "Variable", tool: "English" },
  { id: "english-part-19", title: "English Speaking - Part 19", youtubeId: "vgsxnCWBUGs", duration: "Variable", tool: "English" },
  { id: "english-part-20", title: "English Speaking - Part 20", youtubeId: "rwUEaImPWyA", duration: "Variable", tool: "English" },
];

// Customer Service Practices videos
const customerServiceVideos: VideoData[] = [
  { id: "customer-part-1", title: "Customer Service Practices - Part 1", youtubeId: "a2ytQ2jLFYY", duration: "Variable", tool: "CustomerService" },
  { id: "customer-part-2", title: "Customer Service Practices - Part 2", youtubeId: "wliR_AuPnx8", duration: "Variable", tool: "CustomerService" },
  { id: "customer-part-3", title: "Customer Service Practices - Part 3", youtubeId: "sV-aQakkMkM", duration: "Variable", tool: "CustomerService" },
  { id: "customer-part-4", title: "Customer Service Practices - Part 4", youtubeId: "yRdxH98Gwng", duration: "Variable", tool: "CustomerService" },
  { id: "customer-part-5", title: "Customer Service Practices - Part 5", youtubeId: "TwZNjSydyT0", duration: "Variable", tool: "CustomerService" },
  { id: "customer-part-6", title: "Customer Service Practices - Part 6", youtubeId: "hMgODrWAyFw", duration: "Variable", tool: "CustomerService" },
  { id: "customer-part-7", title: "Customer Service Practices - Part 7", youtubeId: "Moyvptggt-s", duration: "Variable", tool: "CustomerService" },
  { id: "customer-part-8", title: "Customer Service Practices - Part 8", youtubeId: "dmQDidCQ5zc", duration: "Variable", tool: "CustomerService" },
  { id: "customer-part-9", title: "Customer Service Practices - Part 9", youtubeId: "jegUaf4PJL4", duration: "Variable", tool: "CustomerService" },
  { id: "customer-part-10", title: "Customer Service Practices - Part 10", youtubeId: "dYumjlA5yu0", duration: "Variable", tool: "CustomerService" },
  { id: "customer-part-11", title: "Customer Service Practices - Part 11", youtubeId: "T1dFKAP0Vm4", duration: "Variable", tool: "CustomerService" },
  { id: "customer-part-12", title: "Customer Service Practices - Part 12", youtubeId: "XekXeJtB4lI", duration: "Variable", tool: "CustomerService" },
  { id: "customer-part-13", title: "Customer Service Practices - Part 13", youtubeId: "1iJn6quPp50", duration: "Variable", tool: "CustomerService" },
  { id: "customer-part-14", title: "Customer Service Practices - Part 14", youtubeId: "lezQQ0d1pxc", duration: "Variable", tool: "CustomerService" },
];

// Interview Preparation videos (RV Students)
const interviewPrepVideos: VideoData[] = [
  { id: "interview-coding", title: "Interview Preparation - Coding Questions", youtubeId: "7UlslIXHNsw", duration: "Variable", tool: "Interview" },
  { id: "interview-behaviour", title: "Interview Preparation - Behaviour", youtubeId: "sv-3crA1img", duration: "Variable", tool: "Interview" },
  { id: "interview-cracking", title: "Interview Preparation - Prep for Cracking Interviews", youtubeId: "cfjvEy-GK8o", duration: "Variable", tool: "Interview" },
];

export default function Learning() {
  const { t } = useTranslation();

  // Course modules for Learning page
  const modules: CourseModule[] = [
    {
      id: "course-001",
      title: t("learning.microsoft.title"),
      description: t("learning.microsoft.desc"),
      duration: "Variable",
      lessons: 9,
      status: "not-started" as const,
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
    },
    {
      id: "course-002",
      title: t("learning.email.title"),
      description: t("learning.email.desc"),
      duration: "6 parts",
      lessons: 6,
      status: "not-started" as const,
      thumbnail: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=225&fit=crop",
    },
    {
      id: "course-003",
      title: "English Speaking and Customer Service",
      description: "Master English speaking skills and professional customer service practices.",
      duration: "Variable",
      lessons: 34,
      status: "not-started" as const,
      thumbnail: "https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=400&h=225&fit=crop",
    },
    {
      id: "course-004",
      title: "Data Entry & Accuracy",
      description: "Improve typing speed and accuracy for efficient data management.",
      duration: "3 hours",
      lessons: 12,
      status: "not-started" as const,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
      youtubeUrl: "https://www.youtube.com/watch?v=sM_oFKIf2cg", // Data Entry Skills Training
    },
    {
      id: "course-005",
      title: "Basic Computer Skills",
      description: "Essential computer operations, file management, and software basics.",
      duration: "2 hours",
      lessons: 8,
      status: "locked" as const,
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop",
      youtubeUrl: "https://www.youtube.com/watch?v=qmeLz7vJAG8", // Computer Basics for Beginners
    },
    {
      id: "course-006",
      title: "Workplace Safety & Ethics",
      description: "Understanding workplace regulations, safety protocols, and professional ethics.",
      duration: "1 hour",
      lessons: 5,
      status: "locked" as const,
      thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=225&fit=crop",
      youtubeUrl: "https://www.youtube.com/watch?v=1eWVEv-rKF0", // Workplace Safety & Professional Ethics
    },
    {
      id: "course-007",
      title: "Interview Preparation (RV Students)",
      description: "Comprehensive interview preparation and job readiness training for RV students.",
      duration: "Variable",
      lessons: 3,
      status: "not-started" as const,
      thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=225&fit=crop",
    },
  ];

  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<Record<string, any>>({});
  const [courseVideoProgress, setCourseVideoProgress] = useState<Record<string, { completed: number; total: number }>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "hi" | "kn" | "hinglish">("en");
  const [showMicrosoftModal, setShowMicrosoftModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEnglishCustomerModal, setShowEnglishCustomerModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [selectedCategory, setSelectedCategory] = useState<"english" | "customer">("english");

  // Initialize user progress from localStorage and load course video progress
  useEffect(() => {
    // Check authentication first
    const token = localStorage.getItem("token");
    const userDataString = localStorage.getItem("user");
    
    console.log('[Learning] Auth check:', { 
      hasToken: !!token, 
      hasUser: !!userDataString,
      token: token ? `${token.substring(0, 20)}...` : 'none',
      userData: userDataString ? JSON.parse(userDataString) : null
    });
    
    if (!token) {
      console.warn('[Learning] ⚠️ No authentication token found! User needs to log in.');
      // Don't redirect automatically, but log a warning
    }
    
    // Get userId from auth (from localStorage)
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData._id || userData.id) {
          const id = userData._id || userData.id;
          setUserId(id);
          // Load user's progress from localStorage
          const progressKey = `progress_${id}`;
          const savedProgress = localStorage.getItem(progressKey);
          if (savedProgress) {
            setUserProgress(JSON.parse(savedProgress));
          }
          // Load course video progress only if authenticated
          if (token) {
            loadCourseVideoProgress();
          }
        }
      } catch (error) {
        console.error("Error loading user progress:", error);
      }
    }
  }, [userId]);

  // Load course video progress from API
  const loadCourseVideoProgress = async () => {
    if (!userId) return;
    
    const courseIds = ["course-001", "course-002", "course-003", "course-007"];
    const progressMap: Record<string, { completed: number; total: number }> = {};
    
    for (const courseId of courseIds) {
      try {
        const { getCourseProgress } = await import("@/lib/videoProgressApi");
        const response = await getCourseProgress(courseId);
        if (response.success && response.data) {
          progressMap[courseId] = {
            completed: response.data.completed || response.data.completedVideos || 0,
            total: response.data.total || response.data.totalVideos || 0,
          };
        } else {
          // Set default based on course
          progressMap[courseId] = getDefaultCourseTotals(courseId);
        }
      } catch (error) {
        console.error(`Error loading progress for ${courseId}:`, error);
        progressMap[courseId] = getDefaultCourseTotals(courseId);
      }
    }
    
    setCourseVideoProgress(progressMap);
  };

  // Get default total videos for a course
  const getDefaultCourseTotals = (courseId: string): { completed: number; total: number } => {
    switch (courseId) {
      case "course-001":
        return { completed: 0, total: beginnerVideos.length + intermediateVideos.length + advancedVideos.length };
      case "course-002":
        return { completed: 0, total: emailVideos.length };
      case "course-003":
        return { completed: 0, total: englishSpeakingVideos.length + customerServiceVideos.length };
      case "course-007":
        return { completed: 0, total: interviewPrepVideos.length };
      default:
        return { completed: 0, total: 0 };
    }
  };

  // Handle video completion - refresh course progress
  const handleVideoCompleted = async (courseId: string) => {
    console.log('[Learning] handleVideoCompleted called for:', courseId, 'userId:', userId);
    
    // Reload progress for the specific course
    if (userId) {
      try {
        // Wait a bit for backend to process
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { getCourseProgress } = await import("@/lib/videoProgressApi");
        const response = await getCourseProgress(courseId);
        console.log('[Learning] Course progress response:', response);
        
        if (response.success && response.data) {
          const completed = response.data.completed || response.data.completedVideos || 0;
          const total = response.data.total || response.data.totalVideos || 0;
          
          console.log('[Learning] Updating course progress:', { courseId, completed, total });
          
          setCourseVideoProgress((prev) => ({
            ...prev,
            [courseId]: {
              completed,
              total,
            },
          }));
          
          // Update course status in localStorage
          const progressKey = `progress_${userId}`;
          const savedProgress = localStorage.getItem(progressKey);
          const currentProgress = savedProgress ? JSON.parse(savedProgress) : {};
          
          const percentage = total > 0 ? (completed / total) * 100 : 0;
          
          // Update course status based on completion
          let newStatus = currentProgress[courseId]?.status || "not-started";
          if (percentage >= 100) {
            newStatus = "completed";
          } else if (percentage > 0) {
            newStatus = "in-progress";
          }
          
          console.log('[Learning] Updating course status:', { courseId, newStatus, percentage, completed, total });
          
          const updatedProgress = {
            ...currentProgress,
            [courseId]: {
              ...currentProgress[courseId],
              status: newStatus,
              lessonsCompleted: completed,
              lastAccessed: new Date().toISOString(),
            },
          };
          
          setUserProgress(updatedProgress);
          localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
        } else {
          console.warn('[Learning] Course progress response not successful:', response);
        }
      } catch (error) {
        console.error(`[Learning] Error refreshing progress for ${courseId}:`, error);
      }
    } else {
      console.warn('[Learning] No userId, cannot refresh progress');
    }
  };

  // Get videos by level
  const getVideosByLevel = () => {
    switch (selectedLevel) {
      case "beginner":
        return beginnerVideos;
      case "intermediate":
        return intermediateVideos;
      case "advanced":
        return advancedVideos;
      default:
        return beginnerVideos;
    }
  };

  // Get videos by category (English Speaking or Customer Service)
  const getVideosByCategory = () => {
    switch (selectedCategory) {
      case "english":
        return englishSpeakingVideos;
      case "customer":
        return customerServiceVideos;
      default:
        return englishSpeakingVideos;
    }
  };

  // Handle Microsoft Skills click
  const handleMicrosoftSkillsClick = () => {
    setShowMicrosoftModal(true);
    setSelectedLevel("beginner");
  };

  // Handle Email Communication click
  const handleEmailCommunicationClick = () => {
    setShowEmailModal(true);
    setSelectedLevel("beginner");
  };

  // Handle English Speaking and Customer Service click
  const handleEnglishCustomerClick = () => {
    setShowEnglishCustomerModal(true);
    setSelectedCategory("english");
  };

  // Handle Interview Preparation click
  const handleInterviewClick = () => {
    setShowInterviewModal(true);
  };

  // Handle course click - open YouTube and update progress
  // SAFETY: Only opens the explicit youtubeUrl, never searches or generates URLs
  const handleCourseClick = (module: CourseModule) => {
    if (module.status === "locked") return;

    // Special handling for Microsoft Skills module
    if (module.id === "course-001") {
      handleMicrosoftSkillsClick();
      return;
    }

    // Special handling for Email Communication module
    if (module.id === "course-002") {
      handleEmailCommunicationClick();
      return;
    }

    // Special handling for English Speaking and Customer Service module
    if (module.id === "course-003") {
      handleEnglishCustomerClick();
      return;
    }

    // Special handling for Interview Preparation module
    if (module.id === "course-007") {
      handleInterviewClick();
      return;
    }

    // Safety check: only proceed if youtubeUrl exists and is valid
    if (!module.youtubeUrl || !module.youtubeUrl.startsWith("https://www.youtube.com/")) {
      console.warn(`⚠️ Invalid or missing YouTube URL for course: ${module.title}`);
      return;
    }

    // Open ONLY the explicitly defined YouTube URL - never modify or search
    window.open(module.youtubeUrl, "_blank");

    // Update progress: mark as "in-progress" if not completed
    if (userId && module.status !== "completed") {
      const progressKey = `progress_${userId}`;
      const updatedProgress = {
        ...userProgress,
        [module.id]: {
          status: "in-progress",
          lastAccessed: new Date().toISOString(),
          lessonsCompleted: userProgress[module.id]?.lessonsCompleted || 0,
          hoursSpent: userProgress[module.id]?.hoursSpent || 0,
        },
      };
      setUserProgress(updatedProgress);
      localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
    }
  };

  // Get the status for display (consider user progress and video completion)
  const getModuleStatus = (module: CourseModule) => {
    if (module.status === "locked") return "locked";
    
    // Check video completion progress
    const progress = courseVideoProgress[module.id];
    if (progress && progress.total > 0) {
      const percentage = (progress.completed / progress.total) * 100;
      if (percentage >= 100) return "completed";
      if (percentage > 0) return "in-progress";
    }
    
    // Fallback to localStorage progress
    if (userId && userProgress[module.id]?.status === "in-progress") return "in-progress";
    if (userId && userProgress[module.id]?.status === "completed") return "completed";
    
    return module.status;
  };

  const completedCount = modules.filter((m) => {
    if (m.status === "locked") return false;
    if (userId && userProgress[m.id]?.status === "completed") return true;
    return m.status === "completed";
  }).length;
  const totalCount = modules.filter((m) => m.status !== "locked").length;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                {t("learning.title")}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t("learning.subtitle")}
              </p>
            </div>
            <Button variant="outline" size="sm" className="hidden md:flex gap-2">
              <Filter className="w-4 h-4" />
              {t("learning.filter")}
            </Button>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl bg-card border border-border mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{t("learning.progress")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("learning.completedOf", { completed: completedCount, total: totalCount })}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">
                {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
              </span>
            </div>
          </div>
          <ProgressBar value={totalCount > 0 ? (completedCount / totalCount) * 100 : 0} size="md" />
        </motion.div>

        {/* Modules Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <ModuleCard
                {...module}
                status={getModuleStatus(module)}
                onClick={() => handleCourseClick(module)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Microsoft Skills Modal */}
        <AnimatePresence>
          {showMicrosoftModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMicrosoftModal(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
              >
                <div className="bg-card rounded-2xl border border-border w-full max-w-4xl my-8 shadow-2xl">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-foreground">{t("learning.microsoft.title")}</h2>
                    <button
                      onClick={() => setShowMicrosoftModal(false)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Level Selection */}
                  <div className="p-6 border-b border-border">
                    <p className="text-sm text-muted-foreground mb-4">{t("learning.microsoft.levelSelect")}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {(["beginner", "intermediate", "advanced"] as const).map((level) => (
                        <Button
                          key={level}
                          onClick={() => setSelectedLevel(level)}
                          className={`flex-1 py-3 font-semibold transition-all ${selectedLevel === level
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "bg-muted text-foreground hover:bg-accent"
                            }`}
                        >
                          <span className="capitalize">{t(`learning.levels.${level}`)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Videos Grid */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getVideosByLevel().map((video, index) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <YouTubeVideoCard 
                            video={video} 
                            courseId="course-001"
                            courseName="Microsoft Skills"
                            language={language}
                            onAskTutor={(payload) => navigate(`/tutor?${new URLSearchParams(payload as any).toString()}`)}
                            onVideoCompleted={handleVideoCompleted}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Email Communication Modal */}
        <AnimatePresence>
          {showEmailModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowEmailModal(false)}
              />
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="bg-card rounded-lg shadow-2xl w-full max-w-4xl border border-border">
                  {/* Header */}
                  <div className="p-6 border-b border-border flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{t("learning.email.title")}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{t("learning.email.desc")}</p>
                    </div>
                    <button
                      onClick={() => setShowEmailModal(false)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Videos Grid */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {emailCommunicationVideos.map((video, index) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <YouTubeVideoCard 
                            video={video} 
                            courseId="course-002"
                            courseName="Email Communication Skills"
                            language={language}
                            onAskTutor={(payload) => navigate(`/tutor?${new URLSearchParams(payload as any).toString()}`)}
                            onVideoCompleted={handleVideoCompleted}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* English Speaking and Customer Service Modal */}
        <AnimatePresence>
          {showEnglishCustomerModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowEnglishCustomerModal(false)}
              />
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="bg-card rounded-2xl border border-border w-full max-w-4xl my-8 shadow-2xl">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-foreground">English Speaking and Customer Service</h2>
                    <button
                      onClick={() => setShowEnglishCustomerModal(false)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Category Selection */}
                  <div className="p-6 border-b border-border">
                    <p className="text-sm text-muted-foreground mb-4">Select a category:</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => setSelectedCategory("english")}
                        className={`flex-1 py-3 font-semibold transition-all ${
                          selectedCategory === "english"
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-muted text-foreground hover:bg-accent"
                        }`}
                      >
                        English Speaking
                      </Button>
                      <Button
                        onClick={() => setSelectedCategory("customer")}
                        className={`flex-1 py-3 font-semibold transition-all ${
                          selectedCategory === "customer"
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-muted text-foreground hover:bg-accent"
                        }`}
                      >
                        Customer Service Practices
                      </Button>
                    </div>
                  </div>

                  {/* Videos Grid */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getVideosByCategory().map((video, index) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <YouTubeVideoCard 
                            video={video} 
                            courseId="course-003"
                            courseName="English Speaking and Customer Service"
                            language={language}
                            onAskTutor={(payload) => navigate(`/tutor?${new URLSearchParams(payload as any).toString()}`)}
                            onVideoCompleted={handleVideoCompleted}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Interview Preparation Modal (RV Students) */}
        <AnimatePresence>
          {showInterviewModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowInterviewModal(false)}
              />
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="bg-card rounded-lg shadow-2xl w-full max-w-4xl border border-border">
                  {/* Header */}
                  <div className="p-6 border-b border-border flex justify-between items-center bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Interview Preparation (RV Students)</h2>
                      <p className="text-sm text-muted-foreground mt-1">Comprehensive interview preparation and job readiness training</p>
                    </div>
                    <button
                      onClick={() => setShowInterviewModal(false)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Videos Grid */}
                  <div className="p-6">
                    {interviewPrepVideos.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {interviewPrepVideos.map((video, index) => (
                          <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            <YouTubeVideoCard 
                              video={video} 
                              courseId="course-007"
                              courseName="Interview Preparation (RV Students)"
                              language={language}
                              onAskTutor={(payload) => navigate(`/tutor?${new URLSearchParams(payload as any).toString()}`)}
                              onVideoCompleted={handleVideoCompleted}
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">Interview preparation videos will be added here.</p>
                        <p className="text-sm text-muted-foreground">Please provide YouTube playlist links to add videos.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

// YouTube Video Card Component
function YouTubeVideoCard({ 
  video, 
  courseId, 
  courseName, 
  language, 
  onAskTutor,
  onVideoCompleted
}: { 
  video: VideoData; 
  courseId: string;
  courseName?: string;
  language?: "en" | "hi" | "kn" | "hinglish";
  onAskTutor?: (payload: { mode: string; courseName: string; topic: string; userQuery: string; language: string }) => void;
  onVideoCompleted?: (courseId: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  const loadSummary = async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      console.log('[YouTube Summary] Requesting summary for:', { youtubeId: video.youtubeId, title: video.title });
      
      const res = await fetch(`${API_BASE_URL}/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeId: video.youtubeId,
          title: video.title,
          language: language || "en",
        }),
      }).catch((fetchError) => {
        console.error('[YouTube Summary] Network/Fetch Error:', fetchError);
        throw new Error(`Failed to connect to server. Is the backend running on ${API_BASE_URL}?`);
      });
      
      console.log('[YouTube Summary] Response status:', res.status);
      
      if (!res.ok) {
        let errorMsg = `HTTP ${res.status}: Failed to generate summary`;
        try {
          const errorData = await res.json();
          errorMsg = errorData?.message || errorMsg;
        } catch {
          errorMsg = await res.text().catch(() => errorMsg);
        }
        console.error('[YouTube Summary] API Error:', errorMsg);
        throw new Error(errorMsg);
      }
      
      const data = await res.json();
      console.log('[YouTube Summary] Response data:', { success: data?.success, hasContent: !!data?.content });
      
      setSummaryText(data?.content || "");
      console.log('[YouTube Summary] Summary loaded successfully');
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Failed to generate summary";
      console.error('[YouTube Summary] Error:', errorMsg);
      setSummaryError(errorMsg);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <a
        href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block flex-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow h-full flex flex-col"
        >
          {/* Thumbnail */}
          <div
            className="relative aspect-video bg-muted overflow-hidden"
            style={{
              backgroundImage: `url(${thumbnailUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className={`absolute inset-0 bg-black/30 transition-all duration-300 ${isHovered ? "bg-black/50" : ""}`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: isHovered ? 1.15 : 1 }}
                transition={{ duration: 0.2 }}
                className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg"
              >
                <Play className="w-6 h-6 text-white fill-white" />
              </motion.div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
              {video.duration}
            </div>
          </div>

          {/* Video Info */}
          <div className="p-4 flex-1">
            <h3 className="font-semibold text-foreground line-clamp-2">{video.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{video.tool}</p>
          </div>
        </motion.div>
      </a>

      {/* Action Buttons */}
      {(courseName && language && onAskTutor) && (
        <div className="mt-3 px-1 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault();
              setSummaryOpen(true);
              if (!summaryText && !summaryLoading) {
                loadSummary();
              }
            }}
          >
            AI Summary
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault();
              if (onAskTutor && courseName) {
                onAskTutor({
                  mode: "doubt",
                  courseName,
                  topic: video.title,
                  userQuery: `I'm learning from "${video.title}". Can you help me understand it step-by-step?`,
                  language: language || "en",
                });
              }
            }}
          >
            Ask Tutor
          </Button>
        </div>
      )}

        {/* Completion Checkbox */}
        <div className="mt-3 px-1">
          <VideoCompletionCheckbox 
            courseId={courseId} 
            videoId={video.id}
            onCompleted={() => onVideoCompleted?.(courseId)}
          />
        </div>

      {/* AI Summary Dialog */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Summary: {video.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {summaryLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                <span className="text-muted-foreground">Generating summary...</span>
              </div>
            )}
            {summaryError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
                <p className="font-semibold mb-1">Error</p>
                <p className="text-sm">{summaryError}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={loadSummary}
                >
                  Try Again
                </Button>
              </div>
            )}
            {summaryText && !summaryLoading && (
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{summaryText}</div>
                {onAskTutor && courseName && (
                  <div className="mt-6 pt-4 border-t">
                    <Button
                      onClick={() => {
                        setSummaryOpen(false);
                        onAskTutor({
                          mode: "doubt",
                          courseName,
                          topic: video.title,
                          userQuery: `I watched "${video.title}". Please explain the key ideas and help me with any confusion.`,
                          language: language || "en",
                        });
                      }}
                      className="w-full"
                    >
                      Ask AI Tutor
                    </Button>
                  </div>
                )}
              </div>
            )}
            {!summaryText && !summaryLoading && !summaryError && (
              <Button
                onClick={loadSummary}
                className="w-full"
              >
                Generate Summary
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
