import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Play } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Video data for each level and tool
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

// Intermediate level videos (different videos for same tools)
const intermediateVideos: VideoData[] = [
  {
    id: "excel-intermediate",
    title: "Excel Formulas & Functions",
    youtubeId: "BkvVvbqe2q4", // Updated with actual intermediate ID from previous refactor if available
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

// Advanced level videos (more complex topics)
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

// YouTube embed card component
interface YouTubeCardProps {
  video: VideoData;
}

function YouTubeCard({ video }: YouTubeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  // Get actual YouTube thumbnail
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <a
        href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow">
          {/* Thumbnail Container */}
          <div
            className="relative aspect-video bg-muted overflow-hidden"
            style={{
              backgroundImage: `url(${thumbnailUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

            {/* Play Button */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? "bg-black/50" : "bg-black/30"
                }`}
            >
              <motion.div
                animate={{ scale: isHovered ? 1.15 : 1 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg"
              >
                <Play className="w-7 h-7 text-white fill-white" />
              </motion.div>
            </div>

            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
              {video.duration}
            </div>
          </div>

          {/* Video Info */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{video.tool}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {t("tutor.generateAnother")} {/* Reusing similar key or just watch button */}
              </span>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export default function MicrosoftSkills() {
  const { t } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced">(
    "beginner"
  );

  // Select videos based on level
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

  const videos = getVideosByLevel();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {t("learning.microsoft.title")}
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                {t("learning.microsoft.desc")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Level Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {(["beginner", "intermediate", "advanced"] as const).map((level) => (
              <Button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`flex-1 py-6 text-base font-semibold transition-all ${selectedLevel === level
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card border border-border text-foreground hover:bg-accent"
                  }`}
              >
                <span className="capitalize">{t(`learning.levels.${level}`)}</span>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Current Level Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-4 rounded-lg border bg-blue-500/10 border-blue-500/30"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-current opacity-75" />
            <span className="font-semibold text-foreground capitalize">
              {t(`learning.levels.${selectedLevel}`)}
            </span>
          </div>
        </motion.div>

        {/* Videos Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {t("nav.learning")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <YouTubeCard video={video} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-6 rounded-lg bg-card border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            💡 Tips
          </h3>
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li className="flex gap-3">
              <span className="text-primary font-semibold min-w-fit">•</span>
              <span>Watch videos in full screen for the best learning experience</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold min-w-fit">•</span>
              <span>Practice along with the instructor to retain knowledge better</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
