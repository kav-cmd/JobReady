import { cn } from "@/lib/utils";
import { CheckCircle, Clock, PlayCircle, Lock } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  duration: string;
  lessons: number;
  status: "locked" | "not-started" | "in-progress" | "completed";
  thumbnail?: string;
  onClick?: () => void;
  className?: string;
}

export function ModuleCard({
  title,
  description,
  duration,
  lessons,
  status,
  thumbnail,
  onClick,
  className,
}: ModuleCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "in-progress":
        return <PlayCircle className="w-5 h-5 text-primary" />;
      case "locked":
        return <Lock className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "locked":
        return "Locked";
      default:
        return "Not Started";
    }
  };

  return (
    <div
      onClick={status !== "locked" ? onClick : undefined}
      className={cn(
        "overflow-hidden rounded-xl border bg-card transition-all duration-200",
        status === "locked" && "opacity-60 cursor-not-allowed",
        status !== "locked" && "cursor-pointer hover:shadow-md hover:border-primary/30",
        status === "completed" && "border-success/30",
        className
      )}
    >
      {thumbnail && (
        <div className="aspect-video w-full bg-muted overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-card-foreground line-clamp-2">{title}</h3>
          {getStatusIcon()}
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-3 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span>{duration}</span>
            <span>•</span>
            <span>{lessons} lessons</span>
          </div>
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              status === "completed" && "bg-success/10 text-success",
              status === "in-progress" && "bg-primary/10 text-primary",
              status === "locked" && "bg-muted text-muted-foreground",
              status === "not-started" && "bg-secondary text-secondary-foreground"
            )}
          >
            {getStatusLabel()}
          </span>
        </div>
      </div>
    </div>
  );
}
