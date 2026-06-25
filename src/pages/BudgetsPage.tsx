import { useFinanceStore } from "@/lib/finance-store";
import BudgetCard from "@/components/BudgetCard";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BudgetsPage({ store }: { store: ReturnType<typeof useFinanceStore> }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-extrabold text-lg">{t("budgetManager")}</h1>
      </div>
      <div className="px-4 space-y-3">
        <p className="text-sm text-muted-foreground font-medium">{t("trackSpending")}</p>
        {store.budgets.map((b, i) => (
          <div key={b.id} style={{ animationDelay: `${i * 80}ms` }}>
            <BudgetCard budget={b} />
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
