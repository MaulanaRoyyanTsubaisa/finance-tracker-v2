import AddTransactionForm from "@/components/AddTransactionForm";
import BottomNav from "@/components/BottomNav";
import { useFinanceStore } from "@/lib/finance-store";

export default function AddPage({ store }: { store: ReturnType<typeof useFinanceStore> }) {
  return (
    <>
      <AddTransactionForm
        expenseCategories={store.allExpenseCategories}
        incomeCategories={store.allIncomeCategories}
        onAdd={store.addTransaction}
        onAddCategory={store.addCustomCategory}
      />
      <BottomNav />
    </>
  );
}
