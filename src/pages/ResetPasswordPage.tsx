import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }
    if (password.length < 6) {
      toast.error(t("passwordMinLength"));
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success(t("passwordChanged"));
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || t("passwordChangeFail"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        <div className="text-center">
          <span className="text-6xl">🔑</span>
          <h1 className="text-2xl font-extrabold mt-3">{t("resetPassword")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("enterNewPassword")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t("newPassword")}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t("minChars")}
              className="w-full px-4 py-3 input-clay text-sm"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t("confirmPassword")}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder={t("retypePassword")}
              className="w-full px-4 py-3 input-clay text-sm"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 btn-clay gradient-hero text-primary-foreground text-base disabled:opacity-50"
          >
            {loading ? t("loading") : t("changePassword")}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <button onClick={() => navigate("/auth")} className="font-bold text-primary hover:underline">
            {t("backToLogin")}
          </button>
        </p>
      </div>
    </div>
  );
}
