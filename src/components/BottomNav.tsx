import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";

const NAV_ITEMS: { path: string; icon: string; labelKey: TranslationKey; isMain?: boolean }[] = [
  { path: "/", icon: "🏠", labelKey: "navHome" },
  { path: "/budgets", icon: "📊", labelKey: "navBudget" },
  { path: "/add", icon: "➕", labelKey: "navAdd", isMain: true },
  { path: "/history", icon: "🕒", labelKey: "navHistory" },
  { path: "/achievements", icon: "🏆", labelKey: "navXp" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 clay-card max-w-md mx-auto">
      <div className="grid grid-cols-5 items-center px-2 py-2">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path;
          if (item.isMain) {
            return (
              <div key={item.path} className="flex justify-center">
                <button
                  onClick={() => navigate(item.path)}
                  aria-label={t(item.labelKey)}
                  className="flex items-center justify-center w-14 h-14 -mt-6 rounded-full gradient-hero shadow-soft text-primary-foreground transition-transform active:scale-95"
                >
                  <span className="text-2xl">{item.icon}</span>
                </button>
              </div>
            );
          }
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 h-14 rounded-xl transition-colors ${
                active ? "text-primary font-bold" : "text-muted-foreground opacity-80"
              }`}
            >
              <span className={`text-xl shrink-0 ${active ? "scale-110" : ""} transition-transform`}>{item.icon}</span>
              <span className="text-[10px] font-semibold leading-none">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
