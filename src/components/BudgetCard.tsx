import type { Budget } from "@/lib/finance-store";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "bg-peach", Transport: "bg-sky", Bills: "bg-lavender",
  Shopping: "bg-mint", Entertainment: "bg-lemon", Coffee: "bg-peach",
};

export default function BudgetCard({ budget }: { budget: Budget }) {
  const { t } = useLanguage();
  const { formatMoney } = useCurrency();
  const pct = Math.min(budget.spent / budget.limit, 1);
  const pctNum = Math.round(pct * 100);
  const barColor = pct >= 1 ? "bg-destructive" : pct >= 0.8 ? "bg-warning" : "bg-success";
  const bgColor = CATEGORY_COLORS[budget.category] || "bg-muted";

  return (
    <div className="p-4 rounded-2xl bg-card shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${bgColor}`} />
          <span className="font-bold text-sm">{budget.category}</span>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">{pctNum}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${pctNum}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>{formatMoney(budget.spent)}</span>
        <span>{formatMoney(budget.limit)}</span>
      </div>
      {pct >= 0.8 && (
        <p className="text-xs mt-2 font-semibold text-destructive">
          {pct >= 1 ? t("budgetDepleted") : t("budgetAlmost")}
        </p>
      )}
    </div>
  );
}
