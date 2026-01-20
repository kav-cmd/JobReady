import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  FileText,
  MessageCircle,
  Settings,
  User,
  Menu,
  X,
  Zap,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

export function Navigation() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("User");

  const navItems = [
    { label: t("nav.dashboard"), icon: Home, path: "/dashboard" },
    { label: t("nav.learning"), icon: BookOpen, path: "/learning" },
    { label: t("nav.resume"), icon: FileText, path: "/resume" },
    { label: t("nav.aiTutor"), icon: MessageCircle, path: "/tutor" },
    { label: t("nav.settings"), icon: Settings, path: "/settings" },
  ];

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "kn", label: "ಕನ್ನಡ" },
  ];

  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData.name) {
          setUserName(userData.name);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex-col z-40">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">JobReady</span>
          </Link>
        </div>

        <div className="flex-1 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Language Selector */}
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Globe className="w-3 h-3" />
            Language
          </div>
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="w-full text-sm bg-accent/50 border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 border-t border-border">
          <Link
            to="/profile"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{t("nav.viewProfile")}</p>
            </div>
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation Header */}
      <nav className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 px-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground">JobReady</span>
        </Link>

        <div className="flex items-center gap-2">
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="text-xs bg-accent/50 border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label.substring(0, 2).toUpperCase()}
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-foreground/20 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "md:hidden fixed top-16 left-0 right-0 bg-card border-b border-border z-40 transition-all duration-200",
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <ul className="p-4 space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
