import { DashboardLayout } from "@/components/DashboardLayout";
import { ProgressBar } from "@/components/ProgressBar";
import { SkillCard } from "@/components/SkillCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Trophy,
  TrendingUp,
  ArrowRight,
  Zap,
  Target,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

// Backend-ready progress interface
interface UserProgress {
  [courseId: string]: {
    status: "not-started" | "in-progress" | "completed";
    lessonsCompleted: number;
    hoursSpent: number;
    lastAccessed?: string;
  };
}

// User stats interface
interface UserStats {
  hoursSpent: number;
  lessonsCompleted: number;
  coursesCompleted: number;
  skillsLearned: number;
  jobMatch: number;
  overallProgress: number;
}

const skillsData = [
  {
    id: "skill-001",
    title: "Microsoft Excel Basics",
    description: "Learn spreadsheet fundamentals",
    status: "not-started" as const,
  },
  {
    id: "skill-002",
    title: "Email Communication",
    description: "Professional email writing skills",
    status: "not-started" as const,
  },
  {
    id: "skill-003",
    title: "Customer Service",
    description: "Handling customer interactions",
    status: "not-started" as const,
  },
  {
    id: "skill-004",
    title: "Data Entry Specialist",
    description: "Fast and accurate data input",
    status: "locked" as const,
  },
];

const quickActions = [
  { label: "Continue Learning", icon: BookOpen, path: "/learning", color: "primary" },
  { label: "Update Resume", icon: Target, path: "/resume", color: "primary" },
  { label: "Ask AI Tutor", icon: Zap, path: "/tutor", color: "success" },
];

export default function Dashboard() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [stats, setStats] = useState<UserStats>({
    hoursSpent: 0,
    lessonsCompleted: 0,
    coursesCompleted: 0,
    skillsLearned: 0,
    jobMatch: 0,
    overallProgress: 0,
  });

  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData.name) {
          setUserName(userData.name);
          // Extract first name
          const firstName = userData.name.split(" ")[0];
          setUserFirstName(firstName);
        } else {
          setUserFirstName("");
        }
        if (userData._id || userData.id) {
          const id = userData._id || userData.id;
          setUserId(id);

          // Load user's progress from localStorage
          const progressKey = `progress_${id}`;
          const savedProgress = localStorage.getItem(progressKey);
          if (savedProgress) {
            const progress: UserProgress = JSON.parse(savedProgress);
            setUserProgress(progress);

            // Calculate stats from progress
            calculateStats(progress);
          }
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserFirstName("");
      }
    } else {
      setUserFirstName("");
    }
  }, []);

  // Calculate user stats from progress data
  const calculateStats = (progress: UserProgress) => {
    let hoursSpent = 0;
    let lessonsCompleted = 0;
    let coursesCompleted = 0;

    Object.values(progress).forEach((courseProgress) => {
      hoursSpent += courseProgress.hoursSpent || 0;
      lessonsCompleted += courseProgress.lessonsCompleted || 0;
      if (courseProgress.status === "completed") {
        coursesCompleted += 1;
      }
    });

    // Calculate derived stats
    const skillsLearned = Math.min(coursesCompleted, skillsData.length);
    const jobMatch = Math.round((skillsLearned / skillsData.length) * 100);
    const overallProgress = Object.keys(progress).length > 0 ? Math.round((lessonsCompleted / 50) * 100) : 0;

    setStats({
      hoursSpent,
      lessonsCompleted,
      coursesCompleted,
      skillsLearned,
      jobMatch: isNaN(jobMatch) ? 0 : jobMatch,
      overallProgress: Math.min(overallProgress, 100),
    });
  };

  // Get skill status based on user progress
  const getSkillStatus = (skillId: string) => {
    if (userProgress[skillId]) {
      return userProgress[skillId].status;
    }
    const skill = skillsData.find((s) => s.id === skillId);
    return skill?.status || "not-started";
  };

  // Get skill progress value (0-100)
  const getSkillProgress = (skillId: string) => {
    const progress = userProgress[skillId];
    if (!progress) return 0;
    if (progress.status === "completed") return 100;
    if (progress.status === "in-progress") return Math.min((progress.lessonsCompleted / 8) * 100, 90);
    return 0;
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {userFirstName ? `Welcome back, ${userFirstName} 👋` : "Welcome back 👋"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Continue your learning journey and get closer to your dream job.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">Level {Math.floor(stats.coursesCompleted / 2) + 1}</div>
                <div className="text-sm text-muted-foreground">Competency</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.skillsLearned}/{skillsData.filter(s => s.status !== "locked").length}</div>
                <div className="text-sm text-muted-foreground">Skills Learned</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.jobMatch}%</div>
                <div className="text-sm text-muted-foreground">Job Match</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.hoursSpent}h</div>
                <div className="text-sm text-muted-foreground">Time Spent</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-card border border-border mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Learning Progress</h2>
              <p className="text-sm text-muted-foreground">Data Entry & Office Skills Path</p>
            </div>
            <span className="text-2xl font-bold text-primary">{stats.overallProgress}%</span>
          </div>
          <ProgressBar value={stats.overallProgress} size="lg" />
          <p className="text-sm text-muted-foreground mt-3">
            {stats.coursesCompleted === 0
              ? "Start a course to begin your learning journey!"
              : `You have completed ${stats.lessonsCompleted} lessons. Keep going!`}
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {quickActions.map((action, index) => (
            <Link key={action.label} to={action.path}>
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex-col gap-2 hover:border-primary/30"
              >
                <action.icon className={`w-6 h-6 ${action.color === 'success' ? 'text-success' : 'text-primary'}`} />
                <span className="text-sm">{action.label}</span>
              </Button>
            </Link>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Your Skills</h2>
            <Link to="/learning">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {skillsData.map((skill, index) => (
              <SkillCard
                key={skill.title}
                title={skill.title}
                description={skill.description}
                progress={getSkillProgress(skill.id)}
                status={getSkillStatus(skill.id)}
                icon={<BookOpen className="w-5 h-5" />}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
