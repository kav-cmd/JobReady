import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  BookOpen,
  HelpCircle,
  ListChecks,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AIResponse {
  success: boolean;
  content: string | any[];
  mode: string;
  metadata?: {
    courseName: string;
    topic: string;
    generatedAt: string;
  };
  message?: string;
}

const vocationalCourses = [
  "Data Entry Specialist",
  "Customer Service Representative",
  "Office Assistant",
  "Retail Sales Associate",
  "Bank Teller",
  "Receptionist",
  "Accounting Assistant",
  "Medical Assistant",
  "IT Support Specialist",
];

export default function AITutor() {
  const [mode, setMode] = useState<"quiz" | "notes" | "doubt">("quiz");
  const [courseName, setCourseName] = useState("Data Entry Specialist");
  const [topic, setTopic] = useState("Keyboard Shortcuts");
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [response]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const handleGenerateContent = async () => {
    if (!courseName || !topic) {
      toast({
        title: "Error",
        description: "Please select course and topic",
        variant: "destructive",
      });
      return;
    }

    if (mode === "doubt" && !userQuery) {
      toast({
        title: "Error",
        description: "Please enter your question",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "quiz" ? "/ai/quiz" : mode === "notes" ? "/ai/notes" : "/ai/doubt";

      const requestBody: any = {
        courseName,
        topic,
      };

      if (mode === "doubt") {
        requestBody.userQuery = userQuery;
      }

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: AIResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate content");
      }

      setResponse(data);
      setSelectedAnswer(null);

      toast({
        title: "Success!",
        description: `${mode === "quiz" ? "Quiz" : mode === "notes" ? "Notes" : "Response"} generated successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!response) return null;

    if (mode === "quiz" && Array.isArray(response.content)) {
      return (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              📝 This quiz has {response.content.length} questions. Answer carefully and review explanations!
            </p>
          </div>

          {response.content.map((question: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border rounded-lg p-4 bg-card"
            >
              <h3 className="font-semibold text-foreground mb-3">
                Q{index + 1}. {question.question}
              </h3>
              <div className="space-y-2 mb-4">
                {question.options?.map((option: string, optionIndex: number) => (
                  <button
                    key={optionIndex}
                    onClick={() => setSelectedAnswer(index === 0 ? optionIndex : null)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border-2 transition-all",
                      selectedAnswer === optionIndex && index === 0
                        ? question.correctAnswer === optionIndex
                          ? "border-green-500 bg-green-50 dark:bg-green-950"
                          : "border-red-500 bg-red-50 dark:bg-red-950"
                        : "border-border hover:border-primary/50 bg-background"
                    )}
                  >
                    <span className="font-medium">
                      {String.fromCharCode(65 + optionIndex)}.
                    </span>{" "}
                    {option}
                  </button>
                ))}
              </div>
              {selectedAnswer !== null && index === 0 && (
                <div
                  className={cn(
                    "p-3 rounded-lg text-sm",
                    question.correctAnswer === selectedAnswer
                      ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200"
                      : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200"
                  )}
                >
                  <p className="font-semibold mb-1">
                    {question.correctAnswer === selectedAnswer ? "✅ Correct!" : "❌ Incorrect"}
                  </p>
                  <p>{question.explanation}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      );
    }

    if (mode === "notes" && typeof response.content === "string") {
      return (
        <div className="prose dark:prose-invert max-w-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border border-border rounded-lg p-6 whitespace-pre-wrap text-sm leading-relaxed"
          >
            {response.content}
          </motion.div>
        </div>
      );
    }

    if (mode === "doubt" && typeof response.content === "string") {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h3 className="font-semibold text-foreground mb-3">💡 Response to your question:</h3>
          <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {response.content}
          </div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
            AI Tutor
          </h1>
          <p className="text-muted-foreground">
            Get personalized quizzes, study notes, and answers to your doubts
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <div className="bg-card border border-border rounded-lg p-4 space-y-4 sticky top-20">
              {/* Mode Selection */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Mode</Label>
                <div className="space-y-2">
                  {[
                    { id: "quiz", label: "Quiz", icon: ListChecks },
                    { id: "notes", label: "Notes", icon: BookOpen },
                    { id: "doubt", label: "Doubt", icon: HelpCircle },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => {
                        setMode(id as any);
                        setResponse(null);
                        setSelectedAnswer(null);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all border",
                        mode === id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Selection */}
              <div>
                <Label htmlFor="course" className="text-sm font-semibold mb-2 block">
                  Course
                </Label>
                <select
                  id="course"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {vocationalCourses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Input */}
              <div>
                <Label htmlFor="topic" className="text-sm font-semibold mb-2 block">
                  Topic
                </Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Keyboard Shortcuts"
                  className="text-sm"
                />
              </div>

              {/* User Query (for doubt mode) */}
              {mode === "doubt" && (
                <div>
                  <Label htmlFor="query" className="text-sm font-semibold mb-2 block">
                    Your Question
                  </Label>
                  <textarea
                    id="query"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Ask your question..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    rows={4}
                  />
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerateContent}
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? "Generating..." : "Generate"}
              </Button>
            </div>
          </motion.div>

          {/* Response Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2"
          >
            {response ? (
              <div className="space-y-4">
                {/* Metadata */}
                <div className="bg-accent/50 border border-border rounded-lg p-3 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{response.metadata?.courseName}</span> •{" "}
                    <span className="font-medium text-foreground">{response.metadata?.topic}</span>
                  </p>
                </div>

                {/* Content */}
                <div className="max-h-[500px] overflow-y-auto">
                  {renderContent()}
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setResponse(null);
                    setSelectedAnswer(null);
                  }}
                  className="w-full"
                >
                  Generate Another
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-2">No content generated yet</p>
                <p className="text-sm text-muted-foreground">
                  Select a mode, course, and topic, then click Generate to get started!
                </p>
              </div>
            )}
          </motion.div>
        </div>

        <div ref={messagesEndRef} />
      </div>
    </DashboardLayout>
  );
}
