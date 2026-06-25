import { useState } from "react";
import { useFinanceStore, Transaction } from "@/lib/finance-store";
import { useCurrency } from "@/contexts/CurrencyContext";
import { exportToCSV, exportToPDF } from "@/lib/export-utils";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft, Trash2, Pencil, X, Check, CalendarIcon, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, isWithinInterval, subMonths, format, isEqual, startOfDay } from "date-fns";
import { id as localeId, enUS } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

type Period = "week" | "month" | "all" | "custom";

const CATEGORY_EMOJI: Record<string, string> = {
  Food: "🍔", Transport: "🚗", Bills: "📄", Shopping: "🛍️",
  Entertainment: "🎬", Coffee: "☕", Others: "📦",
  Salary: "💰", Freelance: "💻", Gift: "🎁",
};

function getFilteredTransactions(transactions: Transaction[], period: Period, monthOffset: number, customDate?: Date) {
  const now = new Date();
  const target = subMonths(now, monthOffset);

  if (period === "all") return transactions;

  if (period === "custom" && customDate) {
    return transactions.filter(tx => {
      const d = startOfDay(parseISO(tx.date));
      return isEqual(d, startOfDay(customDate));
    });
  }

  return transactions.filter(tx => {
    const d = parseISO(tx.date);
    if (period === "week") {
      const start = startOfWeek(target, { weekStartsOn: 1 });
      const end = endOfWeek(target, { weekStartsOn: 1 });
      return isWithinInterval(d, { start, end });
    }
    const start = startOfMonth(target);
    const end = endOfMonth(target);
    return isWithinInterval(d, { start, end });
  });
}

interface EditState {
  id: string;
  amount: string;
  notes: string;
  date: string;
  category: string;
}

export default function HistoryPage({ store }: { store: ReturnType<typeof useFinanceStore> }) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { formatMoney, currency } = useCurrency();
  const dateLocale = lang === "id" ? localeId : enUS;
  const [period, setPeriod] = useState<Period>("month");
  const [monthOffset, setMonthOffset] = useState(0);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);

  const filtered = getFilteredTransactions(store.transactions, period, monthOffset, customDate);
  const target = subMonths(new Date(), monthOffset);
  const periodLabel = period === "all" ? t("all")
    : period === "custom" ? (customDate ? format(customDate, "dd MMMM yyyy", { locale: dateLocale }) : t("pickDate"))
    : period === "week"
      ? `${t("week")}${monthOffset > 0 ? ` (-${monthOffset})` : ""}`
      : format(target, "MMMM yyyy", { locale: dateLocale });

  const handleDelete = (id: string) => {
    store.deleteTransaction(id);
  };

  const handleStartEdit = (tx: Transaction) => {
    setEditing({ id: tx.id, amount: tx.amount.toString(), notes: tx.notes, date: tx.date, category: tx.category });
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    const amt = Number(editing.amount);
    if (!amt || amt <= 0) return;
    store.updateTransaction(editing.id, { amount: amt, notes: editing.notes, date: editing.date, category: editing.category });
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-extrabold text-lg flex-1">{t("historyTitle")}</h1>
        <div className="flex gap-1">
          <button
            onClick={() => exportToCSV(filtered, "transactions.csv")}
            className="px-3 py-2 rounded-xl bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            title={t("exportCSV")}
          >
            CSV
          </button>
          <button
            onClick={() => exportToPDF(filtered, { totalIncome: store.totalIncome, totalExpense: store.totalExpense, balance: store.balance })}
            className="px-3 py-2 rounded-xl bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            title={t("exportPDF")}
          >
            PDF
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {(["week", "month", "all", "custom"] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => { setPeriod(p); setMonthOffset(0); if (p !== "custom") setCustomDate(undefined); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                period === p ? "bg-primary text-primary-foreground shadow-soft" : "bg-muted text-muted-foreground"
              }`}
            >
              {p === "week" ? t("week") : p === "month" ? t("month") : p === "all" ? t("all") : t("dateFilter")}
            </button>
          ))}
        </div>

        {period === "custom" && (
          <Popover>
            <PopoverTrigger asChild>
              <button className={cn(
                "w-full flex items-center gap-2 px-4 py-3 rounded-2xl bg-card shadow-card text-sm font-medium",
                !customDate && "text-muted-foreground"
              )}>
                <CalendarIcon className="w-4 h-4" />
                {customDate ? format(customDate, "dd MMMM yyyy", { locale: dateLocale }) : t("pickDate")}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={customDate} onSelect={setCustomDate} initialFocus className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
        )}

        {(period === "week" || period === "month") && (
          <div className="flex items-center justify-between">
            <button onClick={() => setMonthOffset(prev => prev + 1)} className="px-3 py-1.5 rounded-xl bg-muted text-xs font-semibold">
              {t("previous")}
            </button>
            <span className="text-sm font-bold">{periodLabel}</span>
            <button
              onClick={() => setMonthOffset(prev => Math.max(0, prev - 1))}
              disabled={monthOffset === 0}
              className="px-3 py-1.5 rounded-xl bg-muted text-xs font-semibold disabled:opacity-40"
            >
              {t("next")}
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl gradient-income text-primary-foreground">
            <p className="text-[10px] opacity-80">{t("income")}</p>
            <p className="text-sm font-extrabold">
              {formatMoney(filtered.filter(tx => tx.type === "income").reduce((s, tx) => s + tx.amount, 0))}
            </p>
          </div>
          <div className="p-3 rounded-2xl gradient-expense text-primary-foreground">
            <p className="text-[10px] opacity-80">{t("expense")}</p>
            <p className="text-sm font-extrabold">
              {formatMoney(filtered.filter(tx => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0))}
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-muted-foreground animate-fade-in">
            <span className="text-4xl mb-3">🐱</span>
            <p className="font-semibold">{t("noTransactionsPeriod")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((tx, i) => (
              <div key={tx.id} className="p-3 rounded-2xl bg-card shadow-card animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                {editing?.id === tx.id ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0">
                        {CATEGORY_EMOJI[tx.category] || "📦"}
                      </div>
                      <p className="font-bold text-sm">{tx.category}</p>
                      <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-lg ${tx.type === "income" ? "bg-success/20 text-success" : "bg-destructive/10 text-destructive"}`}>
                        {tx.type === "income" ? t("income") : t("expense")}
                      </span>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">{t("nominal")}</label>
                      <div className="flex items-center bg-muted rounded-xl px-3 py-2">
                        <span className="text-muted-foreground text-xs font-bold mr-1">{currency.symbol}</span>
                        <input type="number" value={editing.amount} onChange={e => setEditing({ ...editing, amount: e.target.value })} className="flex-1 bg-transparent text-sm font-bold outline-none" min={1} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">{t("editDate")}</label>
                      <input type="date" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-muted text-sm font-medium outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">{t("editNotes")}</label>
                      <input value={editing.notes} onChange={e => setEditing({ ...editing, notes: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-muted text-sm outline-none" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSaveEdit} className="flex-1 py-2 rounded-xl bg-success/20 text-success text-sm font-bold flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" /> {t("save")}
                      </button>
                      <button onClick={() => setEditing(null)} className="flex-1 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-bold flex items-center justify-center gap-1">
                        <X className="w-4 h-4" /> {t("cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg">
                      {CATEGORY_EMOJI[tx.category] || "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{tx.category}</p>
                      <p className="text-xs text-muted-foreground truncate">{tx.notes}</p>
                    </div>
                    <div className="text-right mr-1">
                      <p className={`text-sm font-bold ${tx.type === "income" ? "text-success" : "text-destructive"}`}>
                        {tx.type === "income" ? "+" : "-"}{formatMoney(tx.amount)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => handleStartEdit(tx)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(tx.id)} className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
