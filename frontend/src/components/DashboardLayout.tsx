import { cn } from "@/lib/utils";
import { Navigation } from "./Navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main
        className={cn(
          "min-h-screen pt-16 md:pt-0 md:ml-64 p-4 md:p-6",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}
