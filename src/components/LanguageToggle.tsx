import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "id" ? "en" : "id")}
      className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
      title={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
    >
      <span>{lang === "id" ? "EN" : "ID"}</span>
    </button>
  );
}
