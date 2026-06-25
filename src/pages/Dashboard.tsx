import { useFinanceStore } from "@/lib/finance-store";
import BalanceCard from "@/components/BalanceCard";
import NotificationBanner from "@/components/NotificationBanner";
import XpBar from "@/components/XpBar";
import ExpenseChart from "@/components/ExpenseChart";
import TransactionList from "@/components/TransactionList";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";

export default function Dashboard({ store }: { store: ReturnType<typeof useFinanceStore> }) {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { profile, initials } = useProfile();
  const displayName = profile.display_name || user?.user_metadata?.full_name || "My Finance";
  const notifications = store.getNotifications(lang);
  const categoryData = store.getCategoryData();
  const mood = store.getMascotMood();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-6 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-3 text-left"
          aria-label="Open settings"
        >
          <Avatar className="w-10 h-10 border-2 border-border">
            {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={displayName} />}
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("goodMorning")}</p>
            <h1 className="font-extrabold text-lg leading-tight">{displayName}</h1>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <Popover open={notifOpen} onOpenChange={setNotifOpen}>
            <PopoverTrigger asChild>
              <button className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center relative hover:bg-muted/80 transition-colors">
                <span className="text-lg">🔔</span>
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3" align="end">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t("noNotifications")}</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 p-2.5 rounded-xl text-sm font-medium ${
                        n.type === "danger"
                          ? "bg-destructive/10 text-destructive"
                          : n.type === "warning"
                          ? "bg-warning/10 text-warning-foreground"
                          : "bg-info/10 text-info"
                      }`}
                    >
                      <span className="shrink-0">
                        {n.type === "danger" ? "🚨" : n.type === "warning" ? "⚠️" : "ℹ️"}
                      </span>
                      <span>{n.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>
          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            aria-label="Settings"
          >
            <span className="text-lg">⚙️</span>
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        <NotificationBanner notifications={notifications} />
        <BalanceCard
          balance={store.balance}
          totalIncome={store.totalIncome}
          totalExpense={store.totalExpense}
          mascotMood={mood}
        />
        <XpBar xp={store.xp} />
        <ExpenseChart data={categoryData} />
        <div>
          <h3 className="font-bold text-sm mb-3">{t("recentTransactions")}</h3>
          <TransactionList transactions={store.transactions} />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
