import { useCurrency, CURRENCIES, CurrencyCode } from "@/contexts/CurrencyContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="h-10 px-3 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground hover:text-foreground transition-colors gap-1"
          title="Currency"
        >
          {currency.symbol}
          <span className="text-[10px]">{currency.code}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 max-h-72 overflow-y-auto" align="end">
        {CURRENCIES.map(c => (
          <button
            key={c.code}
            onClick={() => { setCurrency(c.code as CurrencyCode); setOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
              currency.code === c.code
                ? "bg-primary text-primary-foreground font-bold"
                : "hover:bg-muted text-foreground"
            }`}
          >
            <span className="font-bold w-8">{c.symbol}</span>
            <span className="flex-1 text-left">{c.code}</span>
            <span className="text-xs opacity-70">{c.name}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
