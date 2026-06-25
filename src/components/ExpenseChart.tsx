import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";

const COLORS = [
  "hsl(340, 70%, 65%)", "hsl(170, 50%, 55%)", "hsl(260, 60%, 70%)",
  "hsl(200, 70%, 60%)", "hsl(50, 80%, 60%)", "hsl(20, 80%, 65%)",
  "hsl(300, 50%, 65%)",
];

interface Props {
  data: { name: string; value: number }[];
}

export default function ExpenseChart({ data }: Props) {
  const { t } = useLanguage();
  const { formatMoney } = useCurrency();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-muted-foreground">
        <span className="text-3xl mb-2">📊</span>
        <p className="text-sm font-medium">{t("noDataYet")}</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="p-4 rounded-2xl bg-card shadow-card animate-fade-in">
      <h3 className="font-bold text-sm mb-3">{t("expenseBreakdown")}</h3>
      <div className="flex items-center gap-4">
        <div className="w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatMoney(value)}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "var(--shadow-card)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="flex-1 font-medium truncate">{d.name}</span>
              <span className="text-muted-foreground">{Math.round((d.value / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
