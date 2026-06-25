import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isGuestMode, guestStore, newId } from "@/lib/guest";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  notes: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

export interface UserProfile {
  xp: number;
  level: string;
  badges: string[];
}

const DEFAULT_EXPENSE_CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Coffee", "Others"];
const DEFAULT_INCOME_CATEGORIES = ["Salary", "Freelance", "Gift", "Others"];

const LEVELS = [
  { name: "Beginner 🌱", minXp: 0 },
  { name: "Smart Saver 💰", minXp: 100 },
  { name: "Budget Pro 📊", minXp: 300 },
  { name: "Money Master 👑", minXp: 600 },
  { name: "Finance Legend 🏆", minXp: 1000 },
];

export function getLevel(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      const next = LEVELS[i + 1];
      return {
        current: LEVELS[i],
        next,
        progress: next ? (xp - LEVELS[i].minXp) / (next.minXp - LEVELS[i].minXp) : 1,
      };
    }
  }
  return { current: LEVELS[0], next: LEVELS[1], progress: 0 };
}

const DEFAULT_BUDGETS = [
  { category: "Food", limit: 1500000 },
  { category: "Transport", limit: 500000 },
  { category: "Shopping", limit: 1000000 },
  { category: "Entertainment", limit: 500000 },
  { category: "Coffee", limit: 300000 },
  { category: "Bills", limit: 1500000 },
];

export function useFinanceStore() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [xp, setXp] = useState(0);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from database (or local storage in guest mode)
  useEffect(() => {
    const guest = isGuestMode();

    if (guest) {
      // Init defaults if first time
      let bgs = guestStore.getBudgets();
      if (!bgs || bgs.length === 0) {
        bgs = DEFAULT_BUDGETS.map(b => ({ id: newId(), category: b.category, limit: b.limit, spent: 0 }));
        guestStore.setBudgets(bgs);
      }
      setTransactions(guestStore.getTransactions().map(t => ({ ...t })));
      setBudgets(bgs);
      setXp(guestStore.getXp());
      setLoading(false);
      return;
    }

    if (!user) {
      setTransactions([]);
      setBudgets([]);
      setXp(0);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);

      // Load transactions
      const { data: txData } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (txData) {
        setTransactions(txData.map(t => ({
          id: t.id,
          type: t.type as TransactionType,
          amount: Number(t.amount),
          category: t.category,
          date: t.date,
          notes: t.notes,
        })));
      }

      // Load budgets
      const { data: budgetData } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id);

      if (budgetData && budgetData.length > 0) {
        setBudgets(budgetData.map(b => ({
          id: b.id,
          category: b.category,
          limit: Number(b.budget_limit),
          spent: Number(b.spent),
        })));
      } else if (budgetData && budgetData.length === 0) {
        // Create default budgets for new users
        const inserts = DEFAULT_BUDGETS.map(b => ({
          user_id: user.id,
          category: b.category,
          budget_limit: b.limit,
          spent: 0,
        }));
        const { data: newBudgets } = await supabase
          .from("budgets")
          .insert(inserts)
          .select();
        if (newBudgets) {
          setBudgets(newBudgets.map(b => ({
            id: b.id,
            category: b.category,
            limit: Number(b.budget_limit),
            spent: Number(b.spent),
          })));
        }
      }

      // Load XP from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("xp")
        .eq("user_id", user.id)
        .single();

      if (profile) setXp(profile.xp);

      setLoading(false);
    };

    loadData();
  }, [user]);

  const allExpenseCategories = [...DEFAULT_EXPENSE_CATEGORIES, ...customCategories];
  const allIncomeCategories = DEFAULT_INCOME_CATEGORIES;

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const addTransaction = useCallback(async (tx: Omit<Transaction, "id">) => {
    if (isGuestMode()) {
      const newTx: Transaction = { id: newId(), ...tx };
      const next = [newTx, ...transactions];
      setTransactions(next);
      guestStore.setTransactions(next);

      if (tx.type === "expense") {
        const updated = budgets.map(b =>
          b.category === tx.category ? { ...b, spent: b.spent + tx.amount } : b
        );
        setBudgets(updated);
        guestStore.setBudgets(updated);
      }
      let xpGain = 0;
      if (tx.type === "income") xpGain = 10;
      if (tx.type === "expense" && tx.amount < 100000) xpGain = 5;
      if (xpGain > 0) {
        const newXp = xp + xpGain;
        setXp(newXp);
        guestStore.setXp(newXp);
      }
      return newTx;
    }

    if (!user) return;

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        type: tx.type,
        amount: tx.amount,
        category: tx.category,
        date: tx.date,
        notes: tx.notes,
      })
      .select()
      .single();

    if (error || !data) return;

    const newTx: Transaction = {
      id: data.id,
      type: data.type as TransactionType,
      amount: Number(data.amount),
      category: data.category,
      date: data.date,
      notes: data.notes,
    };
    setTransactions(prev => [newTx, ...prev]);

    // Update budget spent
    if (tx.type === "expense") {
      await supabase
        .from("budgets")
        .update({ spent: budgets.find(b => b.category === tx.category)?.spent! + tx.amount })
        .eq("user_id", user.id)
        .eq("category", tx.category);

      setBudgets(prev =>
        prev.map(b => b.category === tx.category ? { ...b, spent: b.spent + tx.amount } : b)
      );
    }

    // Update XP
    let xpGain = 0;
    if (tx.type === "income") xpGain = 10;
    if (tx.type === "expense" && tx.amount < 100000) xpGain = 5;
    if (xpGain > 0) {
      const newXp = xp + xpGain;
      await supabase.from("profiles").update({ xp: newXp }).eq("user_id", user.id);
      setXp(newXp);
    }

    return newTx;
  }, [user, budgets, xp, transactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    if (isGuestMode()) {
      const nextTx = transactions.filter(t => t.id !== id);
      setTransactions(nextTx);
      guestStore.setTransactions(nextTx);
      if (tx.type === "expense") {
        const updated = budgets.map(b =>
          b.category === tx.category ? { ...b, spent: Math.max(0, b.spent - tx.amount) } : b
        );
        setBudgets(updated);
        guestStore.setBudgets(updated);
      }
      return;
    }

    if (!user) return;

    await supabase.from("transactions").delete().eq("id", id).eq("user_id", user.id);

    if (tx.type === "expense") {
      const budget = budgets.find(b => b.category === tx.category);
      if (budget) {
        const newSpent = Math.max(0, budget.spent - tx.amount);
        await supabase.from("budgets").update({ spent: newSpent }).eq("id", budget.id);
        setBudgets(prev => prev.map(b => b.id === budget.id ? { ...b, spent: newSpent } : b));
      }
    }

    setTransactions(prev => prev.filter(t => t.id !== id));
  }, [user, transactions, budgets]);

  const updateTransaction = useCallback(async (id: string, updates: Partial<Omit<Transaction, "id">>) => {
    if (isGuestMode()) {
      const next = transactions.map(t => t.id === id ? { ...t, ...updates } : t);
      setTransactions(next);
      guestStore.setTransactions(next);
      return;
    }
    if (!user) return;
    await supabase.from("transactions").update(updates).eq("id", id).eq("user_id", user.id);
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [user, transactions]);

  const addCustomCategory = useCallback((cat: string) => {
    setCustomCategories(prev => [...prev, cat]);
  }, []);

  const getMascotMood = useCallback(() => {
    const ratio = totalExpense / (totalIncome || 1);
    if (ratio < 0.4) return "happy";
    if (ratio < 0.7) return "neutral";
    if (ratio < 0.9) return "worried";
    return "broke";
  }, [totalIncome, totalExpense]);

  const getNotifications = useCallback((lang: "id" | "en" = "id") => {
    const notifs: { message: string; type: "warning" | "danger" | "info" }[] = [];
    budgets.forEach(b => {
      const pct = b.spent / b.limit;
      if (pct >= 1) notifs.push({ message: lang === "id" ? `STOP. Budget ${b.category} sudah habis! 🚨` : `STOP. ${b.category} budget is depleted! 🚨`, type: "danger" });
      else if (pct >= 0.9) notifs.push({ message: lang === "id" ? `Hey… budget ${b.category} kamu almost gone 😭` : `Hey… your ${b.category} budget is almost gone 😭`, type: "danger" });
      else if (pct >= 0.8) notifs.push({ message: lang === "id" ? `Budget ${b.category} kamu hampir habis 👀` : `Your ${b.category} budget is running low 👀`, type: "warning" });
    });
    return notifs;
  }, [budgets]);

  const getCategoryData = useCallback(() => {
    const cats: Record<string, number> = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return {
    transactions, budgets, xp, balance, totalIncome, totalExpense, loading,
    allExpenseCategories, allIncomeCategories,
    addTransaction, deleteTransaction, updateTransaction, addCustomCategory, getMascotMood, getNotifications, getCategoryData, getLevel: () => getLevel(xp),
  };
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}
