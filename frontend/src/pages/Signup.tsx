import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Mail, Lock, Phone, User, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function Signup() {
  const { t } = useTranslation();
  const [step, setStep] = useState<"details" | "verify">("details");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "student",
    otp: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast({
        title: t("signup.fillAllFields"),
        description: t("signup.fillAllFields"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("signup.retryOtp"));
      }

      setStep("verify");
      toast({
        title: t("signup.otpSent"),
        description: t("signup.otpSentTo", { email: formData.email }),
      });

      // For development - show OTP if available
      if (data.otp) {
        toast({
          title: "Development Mode",
          description: `OTP: ${data.otp}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : t("signup.retryOtp"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.otp || formData.otp.length !== 6) {
      toast({
        title: "Error",
        description: t("signup.validOtp"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("signup.verifyFailed"));
      }

      // Save token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: t("signup.success"),
        description: t("signup.emailVerified"),
      });

      setTimeout(() => {
        navigate("/profile-setup");
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : t("signup.verifyFailed"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("signup.resendFailed"));
      }

      toast({
        title: t("signup.otpSent"),
        description: t("signup.otpSentTo", { email: formData.email }),
      });

      // For development - show OTP if available
      if (data.otp) {
        toast({
          title: "Development Mode",
          description: `OTP: ${data.otp}`,
        });
      }

      setFormData({ ...formData, otp: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : t("signup.resendFailed"),
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("login.backHome")}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">JobReady</span>
            </Link>

            <h1 className="text-2xl font-bold text-foreground">
              {step === "details" ? t("signup.createAccount") : t("signup.verifyEmail")}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {step === "details"
                ? t("signup.startJourney")
                : t("signup.enterOtp")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            {/* Progress Indicator */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-medium text-primary-foreground">
                  {step === "verify" ? <CheckCircle className="w-4 h-4" /> : "1"}
                </div>
                <span className="text-sm font-medium text-foreground">{t("signup.details")}</span>
              </div>
              <div className="flex-1 h-0.5 bg-border" />
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "verify"
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                    }`}
                >
                  2
                </div>
                <span className={`text-sm font-medium ${step === "verify" ? "text-foreground" : "text-muted-foreground"}`}>
                  {t("signup.verify")}
                </span>
              </div>
            </div>

            <form onSubmit={step === "details" ? handleSendOtp : handleVerifyOtp} className="space-y-5">
              {step === "details" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("signup.fullName")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Rahul Sharma"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="pl-10"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("signup.emailAddress")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="pl-10"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("signup.phoneNumber")}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="pl-10"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t("signup.createPassword")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder={t("signup.passwordMinChars")}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="pl-10"
                        required
                        minLength={6}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="otp">{t("signup.verificationCode")}</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder={t("signup.enter6Digit")}
                    value={formData.otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setFormData({ ...formData, otp: value });
                    }}
                    className="text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                    disabled={loading}
                  />
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    {t("signup.didntReceive")}{" "}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendLoading}
                      className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendLoading ? t("signup.resending") : t("signup.resend")}
                    </button>
                  </p>
                </div>
              )}

              <button type="submit" className="w-full h-11 px-8 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {step === "details" ? t("signup.continue") : t("signup.verifyAndCreate")}
              </button>

              {step === "verify" && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep("details")}
                  disabled={loading}
                >
                  {t("signup.goBack")}
                </Button>
              )}
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t("signup.alreadyHaveAccount")}{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                {t("signup.signIn")}
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl gradient-success flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-success-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            {t("signup.joinLearners")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t("signup.learnersDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}
