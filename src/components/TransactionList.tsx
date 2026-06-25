import { Transaction } from "@/lib/finance-store";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const CATEGORY_EMOJI: Record<string, string> = {
  Food: "🍔", Transport: "🚗", Bills: "📄", Shopping: "🛍️",
  Entertainment: "🎬", Coffee: "☕", Others: "📦",
  Salary: "💰", Freelance: "💻", Gift: "🎁",
};

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const { t } = useLanguage();
  const { formatMoney } = useCurrency();

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-muted-foreground animate-fade-in">
        <span className="text-4xl mb-3">🐱</span>
        <p className="font-semibold">{t("noTransactions")}</p>
        <p className="text-sm">{t("startTracking")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.slice(0, 8).map((tx, i) => (
        <div
          key={tx.id}
          className="flex items-center gap-3 p-3 rounded-2xl bg-card shadow-card hover:shadow-soft transition-shadow animate-fade-in"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg">
            {CATEGORY_EMOJI[tx.category] || "📦"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{tx.category}</p>
            <p className="text-xs text-muted-foreground truncate">{tx.notes}</p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-bold ${tx.type === "income" ? "text-success" : "text-destructive"}`}>
              {tx.type === "income" ? "+" : "-"}{formatMoney(tx.amount)}
            </p>
            <p className="text-[10px] text-muted-foreground">{tx.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
