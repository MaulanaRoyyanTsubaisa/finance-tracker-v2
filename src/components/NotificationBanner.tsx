import { useState } from "react";
import { Notification } from "@/lib/finance-store";

export default function NotificationBanner({ notifications }: { notifications: Notification[] }) {
  const [dismissed, setDismissed] = useState<number[]>([]);

  const visible = notifications.filter((_, i) => !dismissed.includes(i));
  if (visible.length === 0) return null;

  const topNotif = visible[0];
  const idx = notifications.indexOf(topNotif);

  return (
    <div className={`relative p-3 rounded-2xl border-l-4 shadow-sm animate-fade-in ${
      topNotif.type === "danger" 
        ? "bg-destructive/10 border-destructive text-destructive"
        : topNotif.type === "warning"
        ? "bg-warning/10 border-warning text-warning-foreground"
        : "bg-info/10 border-info text-info"
    }`}>
      <div className="flex items-start gap-3 pr-6">
        <div className="shrink-0 mt-0.5">
          {topNotif.type === "danger" ? "🚨" : topNotif.type === "warning" ? "⚠️" : "💡"}
        </div>
        <p className="text-sm font-medium leading-tight">{topNotif.message}</p>
      </div>
      <button 
        onClick={() => setDismissed(prev => [...prev, idx])}
        className="absolute top-2 right-2 p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
      >
        <span className="text-sm">❌</span>
      </button>
    </div>
  );
}
