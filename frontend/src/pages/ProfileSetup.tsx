import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, MapPin, GraduationCap, Target, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const languages = [
  "English",
  "हिन्दी (Hindi)",
  "தமிழ் (Tamil)",
  "తెలుగు (Telugu)",
  "ಕನ್ನಡ (Kannada)",
  "മലയാളം (Malayalam)",
  "मराठी (Marathi)",
  "বাংলা (Bengali)",
  "ગુજરાતી (Gujarati)",
  "ਪੰਜਾਬੀ (Punjabi)",
];

const states = [
  "Maharashtra",
  "Tamil Nadu",
  "Karnataka",
  "Telangana",
  "Gujarat",
  "Uttar Pradesh",
  "Rajasthan",
  "West Bengal",
  "Delhi",
  "Kerala",
];

const educationLevels = [
  "8th Pass",
  "10th Pass",
  "12th Pass",
  "ITI/Diploma",
  "Graduate",
  "Post Graduate",
];

const careerInterests = [
  { id: "it", label: "IT & Software", icon: "💻" },
  { id: "healthcare", label: "Healthcare", icon: "🏥" },
  { id: "mechanical", label: "Mechanical & Auto", icon: "🔧" },
  { id: "electrical", label: "Electrical & Electronics", icon: "⚡" },
  { id: "hospitality", label: "Hospitality & Tourism", icon: "🏨" },
  { id: "retail", label: "Retail & Sales", icon: "🛒" },
  { id: "construction", label: "Construction", icon: "🏗️" },
  { id: "agriculture", label: "Agriculture", icon: "🌾" },
  { id: "beauty", label: "Beauty & Wellness", icon: "💅" },
  { id: "finance", label: "Banking & Finance", icon: "🏦" },
];

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    language: "",
    state: "",
    education: "",
    interests: [] as string[],
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalSteps = 4;

  const toggleInterest = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      toast({
        title: "Profile Complete!",
        description: "Let's assess your skills now.",
      });
      setTimeout(() => {
        navigate("/assessment");
      }, 1000);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.language !== "";
      case 2:
        return formData.state !== "";
      case 3:
        return formData.education !== "";
      case 4:
        return formData.interests.length > 0;
      default:
        return false;
    }
  };

  const stepContent = [
    {
      icon: Briefcase,
      title: "Preferred Language",
      description: "Select the language you're most comfortable learning in",
    },
    {
      icon: MapPin,
      title: "Your Location",
      description: "This helps us find jobs near you",
    },
    {
      icon: GraduationCap,
      title: "Education Level",
      description: "Tell us about your educational background",
    },
    {
      icon: Target,
      title: "Career Interests",
      description: "Select the fields you'd like to explore",
    },
  ];

  const CurrentIcon = stepContent[step - 1].icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">JobReady</span>
          </div>
          <span className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-progress-bg">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <CurrentIcon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  {stepContent[step - 1].title}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {stepContent[step - 1].description}
                </p>
              </div>

              <div className="space-y-6">
                {step === 1 && (
                  <div className="space-y-2">
                    <Label>Select Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) =>
                        setFormData({ ...formData, language: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose your language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-2">
                    <Label>Select State</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        setFormData({ ...formData, state: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-2">
                    <Label>Education Level</Label>
                    <Select
                      value={formData.education}
                      onValueChange={(value) =>
                        setFormData({ ...formData, education: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your education" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {step === 4 && (
                  <div className="grid grid-cols-2 gap-3">
                    {careerInterests.map((interest) => (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => toggleInterest(interest.id)}
                        className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                          formData.interests.includes(interest.id)
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border bg-card hover:border-primary/30"
                        }`}
                      >
                        <span className="text-2xl">{interest.icon}</span>
                        <p className="mt-2 font-medium text-sm text-card-foreground">
                          {interest.label}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
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
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="gap-2"
          >
            {step === totalSteps ? "Start Assessment" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
