import { createContext, useContext, useState, ReactNode } from "react";

export type CurrencyCode = "IDR" | "USD" | "EUR" | "GBP" | "JPY" | "SGD" | "MYR" | "THB" | "AUD" | "CNY";

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  decimals: number;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", locale: "id-ID", decimals: 0 },
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US", decimals: 2 },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE", decimals: 2 },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB", decimals: 2 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP", decimals: 0 },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG", decimals: 2 },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", locale: "ms-MY", decimals: 2 },
  { code: "THB", symbol: "฿", name: "Thai Baht", locale: "th-TH", decimals: 2 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU", decimals: 2 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", locale: "zh-CN", decimals: 2 },
];

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrency: (code: CurrencyCode) => void;
  formatMoney: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: CURRENCIES[0],
  setCurrency: () => {},
  formatMoney: (n) => `Rp${n}`,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem("app-currency");
    return (saved as CurrencyCode) || "IDR";
  });

  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyCode(code);
    localStorage.setItem("app-currency", code);
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatMoney }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
