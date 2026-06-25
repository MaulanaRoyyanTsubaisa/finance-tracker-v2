import BottomNav from "@/components/BottomNav";
import { useFinanceStore, getLevel } from "@/lib/finance-store";
import { ArrowLeft, Star, Zap, Shield, Crown, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";

const BADGES: { nameKey: TranslationKey; descKey: TranslationKey; icon: typeof Star; earned: boolean }[] = [
  { nameKey: "badgeFirstStep", descKey: "badgeFirstStepDesc", icon: Star, earned: true },
  { nameKey: "badgeBudgetSetter", descKey: "badgeBudgetSetterDesc", icon: Shield, earned: true },
  { nameKey: "badgeSaverStreak", descKey: "badgeSaverStreakDesc", icon: Zap, earned: true },
  { nameKey: "badgeMoneyMaster", descKey: "badgeMoneyMasterDesc", icon: Crown, earned: false },
  { nameKey: "badgeZeroWaste", descKey: "badgeZeroWasteDesc", icon: Award, earned: false },
];

export default function AchievementsPage({ store }: { store: ReturnType<typeof useFinanceStore> }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const level = store.getLevel();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-extrabold text-lg">{t("achievementsTitle")}</h1>
      </div>

      <div className="px-4 space-y-4 animate-fade-in">
        <div className="gradient-hero rounded-3xl p-6 text-primary-foreground text-center">
          <p className="text-5xl mb-2">🏅</p>
          <p className="text-sm opacity-80">{t("currentLevel")}</p>
          <h2 className="text-xl font-extrabold">{level.current.name}</h2>
          <p className="text-3xl font-extrabold mt-2">{store.xp} XP</p>
          {level.next && (
            <>
              <div className="h-2 rounded-full bg-primary-foreground/20 mt-4 overflow-hidden">
                <div className="h-full rounded-full bg-primary-foreground/60 transition-all duration-700" style={{ width: `${Math.round(level.progress * 100)}%` }} />
              </div>
              <p className="text-xs opacity-80 mt-2">{level.next.minXp - store.xp} {t("xpTo")} {level.next.name}</p>
            </>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-card shadow-card">
          <h3 className="font-bold text-sm mb-2">{t("howToEarnXp")}</h3>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>{t("xpIncome")}</p>
            <p>{t("xpSmallExpense")}</p>
            <p>{t("xpBudget")}</p>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-3">{t("badges")}</h3>
          <div className="space-y-2">
            {BADGES.map((badge, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-2xl shadow-card animate-fade-in ${
                  badge.earned ? "bg-card" : "bg-muted/50 opacity-60"
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${badge.earned ? "gradient-hero text-primary-foreground" : "bg-muted"}`}>
                  <badge.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{t(badge.nameKey)}</p>
                  <p className="text-xs text-muted-foreground">{t(badge.descKey)}</p>
                </div>
                {badge.earned && <span className="text-success text-xs font-bold">{t("earned")}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
