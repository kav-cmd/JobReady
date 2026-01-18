import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const questions = [
  {
    id: 1,
    question: "How comfortable are you using a computer?",
    options: [
      { label: "Beginner", value: 1 },
      { label: "Can do basic tasks", value: 2 },
      { label: "Comfortable with most tasks", value: 3 },
      { label: "Expert user", value: 4 },
    ],
  },
  {
    id: 2,
    question: "What best describes your communication skills?",
    options: [
      { label: "I prefer not to speak much", value: 1 },
      { label: "I can communicate when needed", value: 2 },
      { label: "I'm good at explaining things", value: 3 },
      { label: "I'm very confident speaking to anyone", value: 4 },
    ],
  },
  {
    id: 3,
    question: "How do you prefer to learn new things?",
    options: [
      { label: "By watching videos", value: "visual" },
      { label: "By reading instructions", value: "reading" },
      { label: "By practicing hands-on", value: "kinesthetic" },
      { label: "By discussing with others", value: "auditory" },
    ],
  },
  {
    id: 4,
    question: "What type of work environment do you prefer?",
    options: [
      { label: "Working alone", value: "solo" },
      { label: "Small team (2-5 people)", value: "small" },
      { label: "Large team", value: "large" },
      { label: "Meeting different people daily", value: "dynamic" },
    ],
  },
  {
    id: 5,
    question: "How do you handle problems?",
    options: [
      { label: "I ask for help immediately", value: 1 },
      { label: "I try once then ask for help", value: 2 },
      { label: "I research and try multiple solutions", value: 3 },
      { label: "I love solving complex problems", value: 4 },
    ],
  },
  {
    id: 6,
    question: "What's your experience with English?",
    options: [
      { label: "I understand basic words", value: 1 },
      { label: "I can read and write simple sentences", value: 2 },
      { label: "I'm comfortable with most conversations", value: 3 },
      { label: "I'm fluent in English", value: 4 },
    ],
  },
  {
    id: 7,
    question: "Are you comfortable working with numbers?",
    options: [
      { label: "Not at all", value: 1 },
      { label: "Basic calculations only", value: 2 },
      { label: "Comfortable with most math", value: 3 },
      { label: "Very good with numbers", value: 4 },
    ],
  },
  {
    id: 8,
    question: "What motivates you most at work?",
    options: [
      { label: "Stable income", value: "stability" },
      { label: "Learning new skills", value: "growth" },
      { label: "Helping others", value: "service" },
      { label: "Recognition and achievements", value: "recognition" },
    ],
  },
];

export default function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string | number) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
      toast({
        title: "Assessment Complete!",
        description: "Analyzing your responses...",
      });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleContinue = () => {
    navigate("/dashboard");
  };

  const currentAnswer = answers[questions[currentQuestion]?.id];

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full gradient-success flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Assessment Complete!
          </h1>
          <p className="text-muted-foreground mb-8">
            Based on your responses, we've created a personalized learning path 
            and job recommendations just for you.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="text-2xl font-bold text-primary">75%</div>
              <div className="text-xs text-muted-foreground">Digital Skills</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="text-2xl font-bold text-success">85%</div>
              <div className="text-xs text-muted-foreground">Communication</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="text-2xl font-bold text-primary">70%</div>
              <div className="text-xs text-muted-foreground">Problem Solving</div>
            </div>
          </div>
          <Button onClick={handleContinue} size="lg" className="gap-2">
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">Skill Assessment</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-progress-bg">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
                  Question {currentQuestion + 1}
                </span>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  {questions[currentQuestion].question}
                </h1>
              </div>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left transition-all duration-200",
                      currentAnswer === option.value
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border bg-card hover:border-primary/30"
                    )}
                  >
                    <span className="font-medium text-card-foreground">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="border-t border-border bg-card py-4">
        <div className="container flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentAnswer === undefined}
            className="gap-2"
          >
            {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
