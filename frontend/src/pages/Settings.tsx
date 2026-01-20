import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Globe,
  Lock,
  Shield,
  LogOut,
  Bell,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
];

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState({
    language: i18n.language || "en",
    notifications: true,
    emailUpdates: true,
    darkMode: false,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (i18n.language && i18n.language !== settings.language) {
      setSettings(prev => ({ ...prev, language: i18n.language }));
    }
  }, [i18n.language]);

  const handleLanguageChange = (value: string) => {
    setSettings({ ...settings, language: value });
    i18n.changeLanguage(value);
  };

  const handleSave = () => {
    toast({
      title: t("settings.saved"),
      description: t("settings.savedDesc"),
    });
  };

  const handleLogout = () => {
    toast({
      title: t("settings.logoutTitle"),
      description: t("settings.logoutDesc"),
    });
    // Clear user data
    localStorage.removeItem("user");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            {t("settings.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("settings.subtitle")}
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Language Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              {t("settings.languageSection.title")}
            </h2>
            <div className="space-y-2">
              <Label>{t("settings.languageSection.label")}</Label>
              <Select
                value={settings.language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("settings.languageSection.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {t("settings.languageSection.description")}
              </p>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              {t("settings.notifications.title")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{t("settings.notifications.pushTitle")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.notifications.pushDesc")}
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{t("settings.notifications.emailTitle")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.notifications.emailDesc")}
                  </p>
                </div>
                <Switch
                  checked={settings.emailUpdates}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailUpdates: checked })
                  }
                />
              </div>
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-primary" />
              {t("settings.password.title")}
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">{t("settings.password.current")}</Label>
                <Input id="current" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">{t("settings.password.new")}</Label>
                <Input id="new" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">{t("settings.password.confirm")}</Label>
                <Input id="confirm" type="password" placeholder="••••••••" />
              </div>
              <Button variant="outline" className="w-full">
                {t("settings.password.updateButton")}
              </Button>
            </div>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              {t("settings.privacy.title")}
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("settings.privacy.desc")}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  {t("settings.privacy.download")}
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  {t("settings.privacy.delete")}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button onClick={handleSave} className="flex-1">
              {t("settings.saveChanges")}
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex-1 gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t("settings.logout")}
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
