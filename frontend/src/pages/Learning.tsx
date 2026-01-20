import { DashboardLayout } from "@/components/DashboardLayout";
import { ModuleCard } from "@/components/ModuleCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Filter, Play, X } from "lucide-react";
import { useState, useEffect } from "react";
import { VideoCompletionCheckbox } from "@/components/VideoCompletionButton";
import { useTranslation } from "react-i18next";

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
  tool: "Excel" | "Word" | "PowerPoint";
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
      title: "Customer Service Excellence",
      description: "Handle customer inquiries professionally and resolve issues effectively.",
      duration: "2.5 hours",
      lessons: 10,
      status: "not-started" as const,
      thumbnail: "https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=400&h=225&fit=crop",
      youtubeUrl: "https://www.youtube.com/watch?v=zHnq3APZQJI", // Customer Service Training
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
  ];

  const [userProgress, setUserProgress] = useState<Record<string, any>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [showMicrosoftModal, setShowMicrosoftModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  // Initialize user progress from localStorage
  useEffect(() => {
    // Get userId from auth (from localStorage)
    const userDataString = localStorage.getItem("user");
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
        }
      } catch (error) {
        console.error("Error loading user progress:", error);
      }
    }
  }, []);

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

  // Get the status for display (consider user progress)
  const getModuleStatus = (module: CourseModule) => {
    if (module.status === "locked") return "locked";
    if (userId && userProgress[module.id]?.status === "in-progress") return "in-progress";
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
                          <YouTubeVideoCard video={video} courseId="course-001" />
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
                          <YouTubeVideoCard video={video} courseId="course-002" />
                        </motion.div>
                      ))}
                    </div>
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
function YouTubeVideoCard({ video, courseId }: { video: VideoData; courseId: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

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

      {/* Completion Checkbox */}
      <div className="mt-3 px-1">
        <VideoCompletionCheckbox courseId={courseId} videoId={video.id} />
      </div>
    </div>
  );
}
