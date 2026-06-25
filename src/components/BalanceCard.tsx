import { useCurrency } from "@/contexts/CurrencyContext";
import Mascot from "./Mascot";
import { useLanguage } from "@/contexts/LanguageContext";

interface BalanceCardProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  mascotMood: "happy" | "neutral" | "worried" | "broke";
}

export default function BalanceCard({ balance, totalIncome, totalExpense, mascotMood }: BalanceCardProps) {
  const { t } = useLanguage();
  const { formatMoney } = useCurrency();

  return (
    <div className="gradient-hero rounded-3xl p-6 text-primary-foreground shadow-soft animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs opacity-90 font-medium uppercase tracking-wide">{t("totalBalance")}</p>
          <h2 className="text-2xl font-extrabold mt-1 truncate">{formatMoney(balance)}</h2>
        </div>
        <Mascot mood={mascotMood} size="sm" showMessage variant="bubble" />
      </div>
      <div className="flex gap-4 mt-5">
        <div className="bg-primary-foreground/20 rounded-2xl px-4 py-3 flex-1">
          <p className="text-[10px] opacity-80 uppercase tracking-widest mb-0.5">{t("income")}</p>
          <p className="text-sm font-bold text-green-200">{formatMoney(totalIncome)}</p>
        </div>
        <div className="bg-primary-foreground/20 rounded-2xl px-4 py-3 flex-1">
          <p className="text-[10px] opacity-80 uppercase tracking-widest mb-0.5">{t("expense")}</p>
          <p className="text-sm font-bold text-red-200">{formatMoney(totalExpense)}</p>
        </div>
      </div>
    </div>
  );
}
