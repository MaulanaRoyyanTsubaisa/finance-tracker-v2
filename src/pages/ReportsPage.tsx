import BottomNav from "@/components/BottomNav";
import { useFinanceStore } from "@/lib/finance-store";
import { exportToCSV, exportToPDF } from "@/lib/export-utils";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function ReportsPage({ store }: { store: ReturnType<typeof useFinanceStore> }) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { formatMoney } = useCurrency();
  const categoryData = store.getCategoryData();
  const topCategory = categoryData.sort((a, b) => b.value - a.value)[0];
  const savingsRate = store.totalIncome > 0 ? Math.round(((store.totalIncome - store.totalExpense) / store.totalIncome) * 100) : 0;

  const insights = [
    topCategory && (lang === "id"
      ? `Pengeluaran terbesar di ${topCategory.name} (${formatMoney(topCategory.value)}) 😅`
      : `You spent the most on ${topCategory.name} (${formatMoney(topCategory.value)}) 😅`),
    savingsRate > 30
      ? (lang === "id" ? `Hebat! Kamu menabung ${savingsRate}% dari pemasukan 🎉` : `Great! You saved ${savingsRate}% of your income 🎉`)
      : savingsRate > 0
        ? (lang === "id" ? `Kamu menabung ${savingsRate}%... bisa lebih hemat lho~ 💪` : `You saved ${savingsRate}%... you can do better~ 💪`)
        : (lang === "id" ? "Pengeluaran lebih dari pemasukan? Saatnya hemat! 😱" : "Spending more than earning? Time to cut back! 😱"),
    lang === "id" ? "Coba kurangi pengeluaran kopi untuk menabung lebih ☕→💰" : "Try reducing coffee spending to save more ☕→💰",
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="w-10 h-10 btn-clay bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-extrabold text-lg flex-1">{t("monthlyReport")}</h1>
        <div className="flex gap-1">
          <button
            onClick={() => exportToCSV(store.transactions, "transactions.csv")}
            className="px-3 py-2 btn-clay bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            CSV
          </button>
          <button
            onClick={() => exportToPDF(store.transactions, { totalIncome: store.totalIncome, totalExpense: store.totalExpense, balance: store.balance })}
            className="px-3 py-2 btn-clay bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            PDF
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4 animate-fade-in">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl gradient-income text-primary-foreground">
            <p className="text-xs opacity-80">{t("totalIncome")}</p>
            <p className="text-lg font-extrabold">{formatMoney(store.totalIncome)}</p>
          </div>
          <div className="p-4 rounded-2xl gradient-expense text-primary-foreground">
            <p className="text-xs opacity-80">{t("totalExpense")}</p>
            <p className="text-lg font-extrabold">{formatMoney(store.totalExpense)}</p>
          </div>
        </div>

        <div className="clay-card p-4">
          <p className="text-xs text-muted-foreground">{t("savings")}</p>
          <p className="text-2xl font-extrabold text-success">{formatMoney(store.balance)}</p>
          <p className="text-xs text-muted-foreground mt-1">({savingsRate}% {t("savingsRate")})</p>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-3">{t("realityCheck")}</h3>
          <div className="space-y-2">
            {insights.map((insight, i) => (
              <div key={i} className="p-3 clay-card text-sm font-medium animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                {insight}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-3">{t("spendingByCategory")}</h3>
          <div className="space-y-2">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-3 p-3 clay-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="flex-1 font-semibold text-sm">{cat.name}</span>
                <span className="font-bold text-sm">{formatMoney(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
