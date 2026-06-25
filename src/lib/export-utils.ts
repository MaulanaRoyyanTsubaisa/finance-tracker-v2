import { Transaction, formatCurrency } from "./finance-store";

const SEP = ";"; // Excel locale ID/EU expects semicolon

function csvCell(value: string | number): string {
  const s = String(value ?? "");
  // Always quote to be safe with separators, quotes, and newlines
  return `"${s.replace(/"/g, '""')}"`;
}

export function exportToCSV(transactions: Transaction[], filename = "transactions.csv") {
  const headers = ["No", "Date", "Type", "Category", "Amount", "Notes"];

  const rows = transactions.map((tx, i) => [
    csvCell(i + 1),
    csvCell(tx.date),
    csvCell(tx.type),
    csvCell(tx.category),
    csvCell(tx.amount), // numeric, no currency symbol so Excel parses it
    csvCell(tx.notes ?? ""),
  ]);

  // "sep=;" hint helps Excel pick the right delimiter regardless of locale
  const lines = [
    `sep=${SEP}`,
    headers.map(csvCell).join(SEP),
    ...rows.map(r => r.join(SEP)),
  ];
  const csv = lines.join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename);
}

export function exportToPDF(
  transactions: Transaction[],
  summary: { totalIncome: number; totalExpense: number; balance: number },
  filename = "transactions.pdf"
) {
  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>${filename}</title>
<style>
  body { font-family: Arial, sans-serif; padding: 24px; color: #222; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .meta { color:#888; font-size:12px; margin-bottom: 16px; }
  .summary { display: flex; gap: 12px; margin: 16px 0 20px; }
  .summary-item { flex:1; padding: 12px 16px; border-radius: 8px; background: #f5f5f5; }
  .summary-item .label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: .5px; }
  .summary-item .value { font-size: 16px; font-weight: bold; margin-top: 4px; }
  .income { color: #16a34a; }
  .expense { color: #dc2626; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; table-layout: fixed; }
  th, td { padding: 8px 10px; border-bottom: 1px solid #eee; vertical-align: top; word-wrap: break-word; }
  th { text-align: left; border-bottom: 2px solid #ddd; font-size: 11px; color: #666; text-transform: uppercase; background:#fafafa; }
  th.num, td.num { text-align: right; }
  th.center, td.center { text-align: center; }
  col.no { width: 6%; } col.date { width: 14%; } col.type { width: 12%; }
  col.cat { width: 20%; } col.amt { width: 18%; } col.notes { width: 30%; }
  .amount-income { color: #16a34a; font-weight: 600; }
  .amount-expense { color: #dc2626; font-weight: 600; }
  @media print { body { padding: 12px; } }
</style>
</head><body>
<h1>Transaction Report</h1>
<div class="meta">Generated: ${new Date().toLocaleString()}</div>
<div class="summary">
  <div class="summary-item"><div class="label">Income</div><div class="value income">${formatCurrency(summary.totalIncome)}</div></div>
  <div class="summary-item"><div class="label">Expense</div><div class="value expense">${formatCurrency(summary.totalExpense)}</div></div>
  <div class="summary-item"><div class="label">Balance</div><div class="value">${formatCurrency(summary.balance)}</div></div>
</div>
<table>
  <colgroup>
    <col class="no"/><col class="date"/><col class="type"/><col class="cat"/><col class="amt"/><col class="notes"/>
  </colgroup>
  <thead><tr>
    <th class="center">No</th><th>Date</th><th>Type</th><th>Category</th><th class="num">Amount</th><th>Notes</th>
  </tr></thead>
  <tbody>
${transactions.map((tx, i) => `<tr>
  <td class="center">${i + 1}</td>
  <td>${tx.date}</td>
  <td>${tx.type}</td>
  <td>${tx.category}</td>
  <td class="num amount-${tx.type}">${tx.type === "income" ? "+" : "-"}${formatCurrency(tx.amount)}</td>
  <td>${(tx.notes ?? "").replace(/</g, "&lt;")}</td>
</tr>`).join("")}
  </tbody>
</table>
</body></html>`;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
