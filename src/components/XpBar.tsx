import { getLevel } from "@/lib/finance-store";
import { useLanguage } from "@/contexts/LanguageContext";

export default function XpBar({ xp }: { xp: number }) {
  const { current, next, progress } = getLevel(xp);
  const { t } = useLanguage();

  return (
    <div className="p-4 rounded-2xl bg-card shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs text-muted-foreground font-medium">{t("level")}</span>
          <p className="font-bold text-sm">{current.name}</p>
        </div>
        <span className="text-lg font-extrabold text-primary">{xp} XP</span>
      </div>
      <div className="h-3 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full gradient-hero transition-all duration-700"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      {next && (
        <p className="text-[10px] text-muted-foreground mt-1.5 text-right">
          {next.minXp - xp} {t("xpTo")} {next.name}
        </p>
      )}
    </div>
  );
}
