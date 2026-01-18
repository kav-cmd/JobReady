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
  Moon,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "te", label: "తెలుగు (Telugu)" },
];

export default function Settings() {
  const [settings, setSettings] = useState({
    language: "en",
    notifications: true,
    emailUpdates: true,
    darkMode: false,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "See you soon!",
    });
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
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
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
              Language Preference
            </h2>
            <div className="space-y-2">
              <Label>Display Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) =>
                  setSettings({ ...settings, language: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
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
                This will change the interface language and learning content.
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
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for new jobs and course updates
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
                  <p className="font-medium text-foreground">Email Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Weekly progress reports and job recommendations
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
              Change Password
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <Input id="new" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input id="confirm" type="password" placeholder="••••••••" />
              </div>
              <Button variant="outline" className="w-full">
                Update Password
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
              Privacy & Data
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your data is encrypted and securely stored. We never share your
                personal information with third parties without your consent.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Download My Data
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  Delete Account
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
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex-1 gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
