import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface Notification {
  message: string;
  type: "warning" | "danger" | "info";
}

export default function NotificationBanner({ notifications }: { notifications: Notification[] }) {
  const [dismissed, setDismissed] = useState<number[]>([]);

  const visible = notifications.filter((_, i) => !dismissed.includes(i));
  if (visible.length === 0) return null;

  const n = visible[0];
  const idx = notifications.indexOf(n);
  const colors = n.type === "danger"
    ? "bg-destructive/10 border-destructive/30 text-destructive"
    : n.type === "warning"
    ? "bg-warning/10 border-warning/30 text-warning-foreground"
    : "bg-info/10 border-info/30 text-info";

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${colors} animate-slide-up`}>
      <AlertTriangle className="w-5 h-5 shrink-0" />
      <p className="text-sm font-semibold flex-1">{n.message}</p>
      <button onClick={() => setDismissed(prev => [...prev, idx])} className="shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
