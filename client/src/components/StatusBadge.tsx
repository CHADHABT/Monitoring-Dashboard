import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: "LOADED" | "FAILED" | "OPEN";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    LOADED: {
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800",
      icon: CheckCircle2,
      label: "Loaded"
    },
    OPEN: {
      className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border-blue-200 dark:border-blue-800",
      icon: Clock,
      label: "Open"
    },
    FAILED: {
      className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200 border-red-200 dark:border-red-800",
      icon: XCircle,
      label: "Failed"
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} rounded-full px-2.5 py-0.5 text-xs font-medium gap-1`} data-testid={`badge-status-${status.toLowerCase()}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
