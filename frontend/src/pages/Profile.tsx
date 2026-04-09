import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, Mail, Phone, Shield, Loader2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, getAuthHeaders, isAuthenticated } from "@/lib/auth";

interface UserProfile {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your profile.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // First try to get from localStorage (fast)
      const localUser = getCurrentUser();
      if (localUser) {
        setProfile(localUser as UserProfile);
        setFormData({
          name: localUser.name || "",
          phone: localUser.phone || "",
        });
      }

      // Then fetch fresh data from backend
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          const { clearAuthData } = await import("@/lib/auth");
          clearAuthData();
          toast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
        throw new Error("Failed to load profile");
      }

      const data = await response.json();
      if (data.success && data.user) {
        setProfile(data.user);
        setFormData({
          name: data.user.name || "",
          phone: data.user.phone || "",
        });
        
        // Update localStorage with fresh data
        const { saveAuthData } = await import("@/lib/auth");
        const token = localStorage.getItem("token");
        if (token) {
          saveAuthData(token, data.user);
        }
      }
    } catch (error) {
      console.error("[Profile] Error loading profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      const headers = getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      if (data.user) {
        setProfile(data.user);
        
        // Update localStorage
        const { saveAuthData } = await import("@/lib/auth");
        const token = localStorage.getItem("token");
        if (token) {
          saveAuthData(token, data.user);
        }
      }

      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("[Profile] Error updating profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Profile not found</p>
          <Button onClick={() => navigate("/login")} className="mt-4">
            Go to Login
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
            <User className="w-8 h-8 text-primary" />
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6 space-y-6"
        >
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              value={profile.email}
              disabled
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Role (Read-only) */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Account Type
            </Label>
            <Input
              value={profile.role === "student" ? "Student" : "Instructor"}
              disabled
              className="bg-muted cursor-not-allowed"
            />
          </div>

          {/* Verification Status */}
          {profile.isVerified !== undefined && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/50">
              <div className={`w-2 h-2 rounded-full ${profile.isVerified ? "bg-green-500" : "bg-yellow-500"}`} />
              <span className="text-sm text-muted-foreground">
                {profile.isVerified ? "Email Verified" : "Email Not Verified"}
              </span>
            </div>
          )}

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving || !formData.name}
            className="w-full gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
