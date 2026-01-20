import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";
import { markVideoCompleted, getVideoStatus } from "@/lib/videoProgressApi";
import { useToast } from "@/hooks/use-toast";

interface VideoCompletionButtonProps {
  courseId: string;
  videoId: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  onCompleted?: () => void;
}

export function VideoCompletionButton({
  courseId,
  videoId,
  size = "default",
  variant = "outline",
  onCompleted,
}: VideoCompletionButtonProps) {
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if video is already completed
  useEffect(() => {
    const checkVideoStatus = async () => {
      try {
        setIsChecking(true);
        const response = await getVideoStatus(courseId, videoId);
        if (response.data) {
          setIsCompleted(response.data.completed || false);
        }
      } catch (error) {
        console.error("Error checking video status:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkVideoStatus();
  }, [courseId, videoId]);

  const handleMarkCompleted = async () => {
    try {
      setIsLoading(true);
      const response = await markVideoCompleted(courseId, videoId);

      if (response.success) {
        setIsCompleted(true);
        toast({
          title: "Great! 🎉",
          description: "Video marked as completed.",
        });
        onCompleted?.();
      } else {
        toast({
          title: "Already Completed",
          description: "This video is already marked as completed.",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark video as completed. Please try again.",
        variant: "destructive",
      });
      console.error("Error marking video completed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <Button size={size} variant={variant} disabled>
        <Circle className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (isCompleted) {
    return (
      <Button size={size} variant="default" disabled className="bg-green-600 hover:bg-green-600">
        <CheckCircle className="w-4 h-4 mr-2" />
        Completed
      </Button>
    );
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleMarkCompleted}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <>
          <span className="animate-spin">⏳</span>
          Marking...
        </>
      ) : (
        <>
          <Circle className="w-4 h-4" />
          Mark as Completed
        </>
      )}
    </Button>
  );
}

interface VideoCompletionCheckboxProps {
  courseId: string;
  videoId: string;
  onCompleted?: () => void;
}

export function VideoCompletionCheckbox({
  courseId,
  videoId,
  onCompleted,
}: VideoCompletionCheckboxProps) {
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated first
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("[VideoCompletionCheckbox] No token found - user not authenticated");
      return;
    }

    const checkVideoStatus = async () => {
      try {
        const response = await getVideoStatus(courseId, videoId);
        if (response.data) {
          setIsCompleted(response.data.completed || false);
        }
      } catch (error) {
        console.error("Error checking video status:", error);
      }
    };

    checkVideoStatus();
  }, [courseId, videoId]);

  const handleToggle = async () => {
    if (isCompleted) return; // Don't allow unchecking

    // Check authentication first
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to mark videos as completed. Redirecting to login page...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    try {
      setIsLoading(true);
      console.log('[VideoCompletionCheckbox] Marking video as completed:', { courseId, videoId, hasToken: !!token });
      
      const response = await markVideoCompleted(courseId, videoId);
      console.log('[VideoCompletionCheckbox] Response:', response);

      if (response.success) {
        setIsCompleted(true);
        toast({
          title: "Perfect! ✓",
          description: "Video marked as completed.",
        });
        console.log('[VideoCompletionCheckbox] Calling onCompleted callback');
        onCompleted?.();
      } else {
        console.warn('[VideoCompletionCheckbox] Response not successful:', response);
        toast({
          title: "Warning",
          description: response.message || "Video may already be completed.",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error('[VideoCompletionCheckbox] Error:', error);
      
      let errorMessage = "Failed to mark video as completed.";
      
      if (error?.message?.includes("401") || error?.message?.includes("Unauthorized") || error?.message?.includes("No token")) {
        errorMessage = "You need to log in again. Please refresh the page and log in.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={handleToggle}
        disabled={isCompleted || isLoading}
        className="w-5 h-5 rounded cursor-pointer accent-primary"
      />
      <span className="text-sm font-medium text-muted-foreground">
        {isCompleted ? "✓ Completed" : "Mark as completed"}
      </span>
    </div>
  );
}
