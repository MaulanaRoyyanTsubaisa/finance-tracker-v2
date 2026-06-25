import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TransactionType } from "@/lib/finance-store";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  expenseCategories: string[];
  incomeCategories: string[];
  onAdd: (tx: { type: TransactionType; amount: number; category: string; date: string; notes: string }) => void;
  onAddCategory: (cat: string) => void;
}

export default function AddTransactionForm({ expenseCategories, incomeCategories, onAdd, onAddCategory }: Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [newCat, setNewCat] = useState("");
  const [showNewCat, setShowNewCat] = useState(false);

  const categories = type === "expense" ? expenseCategories : incomeCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    onAdd({ type, amount: Number(amount), category, date, notes });
    navigate("/");
  };

  const handleAddCategory = () => {
    if (newCat.trim()) {
      onAddCategory(newCat.trim());
      setCategory(newCat.trim());
      setNewCat("");
      setShowNewCat(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-extrabold text-lg">{t("addTransaction")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 space-y-5 animate-fade-in">
        {/* Type toggle */}
        <div className="flex bg-muted rounded-2xl p-1">
          {(["expense", "income"] as const).map(tp => (
            <button
              key={tp}
              type="button"
              onClick={() => { setType(tp); setCategory(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                type === tp
                  ? tp === "expense" ? "gradient-expense text-primary-foreground shadow-soft" : "gradient-income text-primary-foreground shadow-soft"
                  : "text-muted-foreground"
              }`}
            >
              {tp === "expense" ? t("expenseLabel") : t("incomeLabel")}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t("amount")}</label>
          <div className="flex items-center bg-card rounded-2xl shadow-card px-4 py-3">
            <span className="text-muted-foreground font-bold mr-2">{currency.symbol}</span>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 bg-transparent text-2xl font-extrabold outline-none"
              required
              min={1}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">{t("category")}</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  category === c
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowNewCat(!showNewCat)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-muted text-muted-foreground border-2 border-dashed border-border"
            >
              <Plus className="w-3 h-3 inline" /> {t("custom")}
            </button>
          </div>
          {showNewCat && (
            <div className="flex gap-2 mt-2">
              <input
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                placeholder={t("newCategoryName")}
                className="flex-1 px-3 py-2 rounded-xl bg-card shadow-card text-sm outline-none"
              />
              <button type="button" onClick={handleAddCategory} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
                {t("add")}
              </button>
            </div>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t("date")}</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-card shadow-card text-sm font-medium outline-none"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t("notes")}</label>
          <input
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={t("notesPlaceholder")}
            className="w-full px-4 py-3 rounded-2xl bg-card shadow-card text-sm outline-none"
            maxLength={100}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl gradient-hero text-primary-foreground font-extrabold text-base shadow-soft active:scale-[0.98] transition-transform"
        >
          {type === "expense" ? t("addExpense") : t("addIncome")}
        </button>
      </form>
    </div>
  );
}
