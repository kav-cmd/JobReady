import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Lock } from "lucide-react";

interface SkillCardProps {
  title: string;
  description: string;
  progress: number;
  status: "locked" | "in-progress" | "completed";
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function SkillCard({
  title,
  description,
  progress,
  status,
  icon,
  onClick,
  className,
}: SkillCardProps) {
  return (
    <div
      onClick={status !== "locked" ? onClick : undefined}
      className={cn(
        "relative p-4 rounded-xl border bg-card transition-all duration-200",
        status === "locked" && "opacity-60 cursor-not-allowed",
        status !== "locked" && "cursor-pointer hover:shadow-md hover:border-primary/30",
        status === "completed" && "border-success/30 bg-success/5",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
            status === "completed" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
          )}
        >
          {icon || (status === "locked" ? <Lock className="w-5 h-5" /> : <Circle className="w-5 h-5" />)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-card-foreground truncate">{title}</h3>
            {status === "completed" && (
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{description}</p>
          {status !== "locked" && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-progress-bg overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    status === "completed" ? "bg-success" : "bg-primary"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
