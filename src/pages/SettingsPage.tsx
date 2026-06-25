import { useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, Moon, Sun, DollarSign, Bell, BellOff, LogOut, User, Mail, Sparkles, Camera, Pencil, Loader2, Check, X, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency, CURRENCIES, CurrencyCode } from "@/contexts/CurrencyContext";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";
import {
  getReminderSettings,
  saveReminderSettings,
  requestNotificationPermission,
  scheduleDailyReminder,
  cancelReminder,
  testNotification,
  type ReminderSettings,
} from "@/lib/reminder";
import { toast } from "sonner";
import { isGuestMode, guestStore, disableGuestMode } from "@/lib/guest";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();

  const [reminder, setReminder] = useState<ReminderSettings>(() => getReminderSettings());
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );

  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null }>({
    display_name: null,
    avatar_url: null,
  });
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const guest = isGuestMode();

  useEffect(() => {
    if (guest) {
      const p = guestStore.getProfile();
      setProfile(p);
      setNameDraft(p.display_name ?? "");
      return;
    }
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile({ display_name: data.display_name, avatar_url: data.avatar_url });
          setNameDraft(data.display_name ?? "");
        }
      });
  }, [user, guest]);

  useEffect(() => {
    if (reminder.enabled && permission === "granted") {
      scheduleDailyReminder(lang);
    } else {
      cancelReminder();
    }
  }, [reminder, permission, lang]);

  const handleSaveName = async () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) {
      toast.error(lang === "id" ? "Nama tidak boleh kosong" : "Name cannot be empty");
      return;
    }

    if (guest) {
      const next = { ...guestStore.getProfile(), display_name: trimmed };
      guestStore.setProfile(next);
      setProfile(next);
      setEditingName(false);
      window.dispatchEvent(new Event("guest-profile-updated"));
      toast.success(lang === "id" ? "Nama diperbarui ✨" : "Name updated ✨");
      return;
    }

    if (!user) return;
    setSavingName(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: trimmed })
      .eq("user_id", user.id);
    setSavingName(false);
    if (error) {
      toast.error(lang === "id" ? "Gagal menyimpan" : "Failed to save");
      return;
    }
    setProfile((p) => ({ ...p, display_name: trimmed }));
    setEditingName(false);
    toast.success(lang === "id" ? "Nama diperbarui ✨" : "Name updated ✨");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error(lang === "id" ? "Ukuran maksimal 2MB" : "Max size 2MB");
      return;
    }

    if (guest) {
      setUploadingAvatar(true);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result || "");
        const next = { ...guestStore.getProfile(), avatar_url: dataUrl };
        guestStore.setProfile(next);
        setProfile(next);
        setUploadingAvatar(false);
        window.dispatchEvent(new Event("guest-profile-updated"));
        toast.success(lang === "id" ? "Foto profil diperbarui 📸" : "Avatar updated 📸");
      };
      reader.onerror = () => {
        setUploadingAvatar(false);
        toast.error(lang === "id" ? "Gagal membaca file" : "Failed to read file");
      };
      reader.readAsDataURL(file);
      return;
    }

    if (!user) return;
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) {
      setUploadingAvatar(false);
      toast.error(lang === "id" ? "Upload gagal" : "Upload failed");
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: updErr } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("user_id", user.id);
    setUploadingAvatar(false);
    if (updErr) {
      toast.error(lang === "id" ? "Gagal menyimpan avatar" : "Failed to save avatar");
      return;
    }
    setProfile((p) => ({ ...p, avatar_url: publicUrl }));
    toast.success(lang === "id" ? "Foto profil diperbarui 📸" : "Avatar updated 📸");
  };

  const handleReminderToggle = async (checked: boolean) => {
    if (checked) {
      const perm = await requestNotificationPermission();
      setPermission(perm);
      if (perm !== "granted") {
        toast.error(lang === "id" ? "Izin notifikasi ditolak 😢" : "Notification permission denied 😢");
        return;
      }
      const next = { ...reminder, enabled: true };
      setReminder(next);
      saveReminderSettings(next);
      toast.success(lang === "id" ? "Reminder aktif! 🔔" : "Reminder activated! 🔔");
    } else {
      const next = { ...reminder, enabled: false };
      setReminder(next);
      saveReminderSettings(next);
      cancelReminder();
      toast(lang === "id" ? "Reminder dimatikan" : "Reminder disabled");
    }
  };

  const handleTimeChange = (value: string) => {
    const [h, m] = value.split(":").map(Number);
    const next = { ...reminder, hour: h, minute: m };
    setReminder(next);
    saveReminderSettings(next);
  };

  const reminderTime = `${String(reminder.hour).padStart(2, "0")}:${String(reminder.minute).padStart(2, "0")}`;
  const displayName = profile.display_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || (guest ? "Guest" : "User");
  const accountSubtitle = guest
    ? (lang === "id" ? "Mode Tamu · Data lokal" : "Guest Mode · Local data")
    : (user?.email ?? "");

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
          aria-label={t("back")}
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="font-extrabold text-xl">{lang === "id" ? "Pengaturan" : "Settings"}</h1>
          <p className="text-xs text-muted-foreground">{lang === "id" ? "Atur preferensi aplikasimu" : "Manage your preferences"}</p>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Profile Card */}
        <section className="rounded-2xl bg-card border border-border/50 p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-16 h-16 ring-2 ring-border">
                {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={displayName} />}
                <AvatarFallback className="gradient-hero text-primary-foreground font-bold text-2xl">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
                aria-label={lang === "id" ? "Ubah foto" : "Change photo"}
              >
                {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span className="text-[14px]">📷</span>}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
              />
            </div>
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    placeholder={lang === "id" ? "Nama tampilan" : "Display name"}
                    className="h-9"
                    maxLength={50}
                    autoFocus
                  />
                  <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleSaveName} disabled={savingName}>
                    {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 shrink-0"
                    onClick={() => { setEditingName(false); setNameDraft(profile.display_name ?? ""); }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="font-bold text-base truncate">{displayName}</p>
                  <button
                    onClick={() => { setNameDraft(profile.display_name ?? displayName); setEditingName(true); }}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={lang === "id" ? "Edit nama" : "Edit name"}
                  >
                    <span className="text-[12px]">✏️</span>
                  </button>
                </div>
              )}
              <p className="text-xs text-muted-foreground flex items-center gap-1 truncate mt-1">
                <span className="shrink-0 text-[12px]">✉️</span>
                <span className="truncate">{accountSubtitle}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-2xl bg-card border border-border/50 overflow-hidden">
          <h3 className="font-bold text-sm px-4 pt-4 pb-2 text-muted-foreground flex items-center gap-2">
            <span>✨</span>
            {lang === "id" ? "Preferensi" : "Preferences"}
          </h3>

          {/* Language */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <span>🌐</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{t("language")}</p>
                <p className="text-xs text-muted-foreground">{lang === "id" ? "Bahasa Indonesia" : "English"}</p>
              </div>
            </div>
            <Select value={lang} onValueChange={(v) => setLang(v as "id" | "en")}>
              <SelectTrigger className="w-24 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">🇮🇩 ID</SelectItem>
                <SelectItem value="en">🇬🇧 EN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                {theme === "dark" ? <span>🌙</span> : <span>☀️</span>}
              </div>
              <div>
                <p className="font-semibold text-sm">{theme === "dark" ? t("darkMode") : t("lightMode")}</p>
                <p className="text-xs text-muted-foreground">{lang === "id" ? "Ubah tampilan tema" : "Switch app theme"}</p>
              </div>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>

          {/* Currency */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <span>💲</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{t("currency")}</p>
                <p className="text-xs text-muted-foreground">{currency.symbol} {currency.name}</p>
              </div>
            </div>
            <Select value={currency.code} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {CURRENCIES.map(c => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Reminder */}
        <section className="rounded-2xl bg-card border border-border/50 overflow-hidden">
          <h3 className="font-bold text-sm px-4 pt-4 pb-2 text-muted-foreground flex items-center gap-2">
            <span>🔔</span>
            {lang === "id" ? "Notifikasi" : "Notifications"}
          </h3>

          <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                {reminder.enabled ? <span>🔔</span> : <span>🔕</span>}
              </div>
              <div>
                <p className="font-semibold text-sm">{lang === "id" ? "Reminder Harian" : "Daily Reminder"}</p>
                <p className="text-xs text-muted-foreground">{lang === "id" ? "Pengingat catat pengeluaran" : "Remind to log expenses"}</p>
              </div>
            </div>
            <Switch checked={reminder.enabled} onCheckedChange={handleReminderToggle} />
          </div>

          {reminder.enabled && (
            <div className="px-4 py-3 border-t border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">{lang === "id" ? "Waktu pengingat" : "Reminder time"}</label>
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-32 h-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  if (permission !== "granted") {
                    toast.error(lang === "id" ? "Aktifkan reminder dulu" : "Enable reminder first");
                    return;
                  }
                  testNotification(lang);
                  toast.success(lang === "id" ? "Notifikasi tes terkirim 🧪" : "Test notification sent 🧪");
                }}
              >
                {lang === "id" ? "Test Notifikasi 🧪" : "Test Notification 🧪"}
              </Button>
            </div>
          )}

          {permission === "denied" && (
            <p className="text-xs text-destructive px-4 pb-3">
              {lang === "id"
                ? "Izin diblokir. Aktifkan dari pengaturan browser."
                : "Permission blocked. Enable in browser settings."}
            </p>
          )}
        </section>

        {/* Account */}
        <section className="rounded-2xl bg-card border border-border/50 overflow-hidden">
          <h3 className="font-bold text-sm px-4 pt-4 pb-2 text-muted-foreground flex items-center gap-2">
            <span>👤</span>
            {lang === "id" ? "Akun" : "Account"}
          </h3>
          {guest && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full flex items-center gap-3 px-4 py-3 border-t border-border/50 hover:bg-muted/50 transition-colors text-left">
                  <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <span>🗑️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-destructive">
                      {lang === "id" ? "Reset Data" : "Reset Data"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "id" ? "Hapus semua transaksi, budget, XP & profil" : "Clear all transactions, budgets, XP & profile"}
                    </p>
                  </div>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {lang === "id" ? "Reset semua data tamu?" : "Reset all guest data?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {lang === "id"
                      ? "Tindakan ini akan menghapus semua transaksi, budget, XP, dan profil dari perangkat ini. Tidak bisa dibatalkan."
                      : "This will permanently delete all transactions, budgets, XP, and profile on this device. This cannot be undone."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{lang === "id" ? "Batal" : "Cancel"}</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      guestStore.clearAll();
                      window.dispatchEvent(new Event("guest-profile-updated"));
                      toast.success(lang === "id" ? "Data direset ✨" : "Data reset ✨");
                      setTimeout(() => { window.location.href = "/"; }, 400);
                    }}
                  >
                    {lang === "id" ? "Ya, hapus" : "Yes, delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <button
            onClick={async () => {
              disableGuestMode();
              if (!guest) await signOut();
              window.location.href = "/auth";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 border-t border-border/50 hover:bg-muted/50 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <span>🚪</span>
            </div>
            <div>
              <p className="font-semibold text-sm text-destructive">
                {guest
                  ? (lang === "id" ? "Keluar Mode Tamu" : "Exit Guest Mode")
                  : (lang === "id" ? "Keluar" : "Sign Out")}
              </p>
              <p className="text-xs text-muted-foreground">
                {guest
                  ? (lang === "id" ? "Kembali ke halaman login" : "Back to sign in")
                  : (lang === "id" ? "Logout dari akunmu" : "Log out of your account")}
              </p>
            </div>
          </button>
        </section>

        <p className="text-center text-xs text-muted-foreground pt-2">My Finance · v1.0</p>
      </div>

      <BottomNav />
    </div>
  );
}
