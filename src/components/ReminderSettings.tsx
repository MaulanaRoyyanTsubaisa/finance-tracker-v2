import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
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

export default function ReminderSettingsButton() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<ReminderSettings>(() => getReminderSettings());
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );

  useEffect(() => {
    if (settings.enabled && permission === "granted") {
      scheduleDailyReminder(lang);
    } else {
      cancelReminder();
    }
    return () => cancelReminder();
  }, [settings, permission, lang]);

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      const perm = await requestNotificationPermission();
      setPermission(perm);
      if (perm !== "granted") {
        toast.error(lang === "id" ? "Izin notifikasi ditolak 😢" : "Notification permission denied 😢");
        return;
      }
      const next = { ...settings, enabled: true };
      setSettings(next);
      saveReminderSettings(next);
      toast.success(lang === "id" ? "Reminder aktif! 🔔" : "Reminder activated! 🔔");
    } else {
      const next = { ...settings, enabled: false };
      setSettings(next);
      saveReminderSettings(next);
      cancelReminder();
      toast(lang === "id" ? "Reminder dimatikan" : "Reminder disabled");
    }
  };

  const handleTimeChange = (hour: number, minute: number) => {
    const next = { ...settings, hour, minute };
    setSettings(next);
    saveReminderSettings(next);
  };

  const time = `${String(settings.hour).padStart(2, "0")}:${String(settings.minute).padStart(2, "0")}`;
  const supported = typeof Notification !== "undefined";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          title={lang === "id" ? "Reminder Harian" : "Daily Reminder"}
        >
          {settings.enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-sm">
              {lang === "id" ? "Reminder Harian 🔔" : "Daily Reminder 🔔"}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "id"
                ? "Pengingat catat pengeluaran setiap hari"
                : "Daily reminder to log your expenses"}
            </p>
          </div>

          {!supported ? (
            <p className="text-xs text-destructive">
              {lang === "id"
                ? "Browser tidak mendukung notifikasi"
                : "Browser doesn't support notifications"}
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {lang === "id" ? "Aktifkan" : "Enable"}
                </span>
                <Switch checked={settings.enabled} onCheckedChange={handleToggle} />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  {lang === "id" ? "Waktu pengingat" : "Reminder time"}
                </label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    const [h, m] = e.target.value.split(":").map(Number);
                    handleTimeChange(h, m);
                  }}
                  disabled={!settings.enabled}
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
                }}
              >
                {lang === "id" ? "Test Notifikasi 🧪" : "Test Notification 🧪"}
              </Button>

              {permission === "denied" && (
                <p className="text-xs text-destructive">
                  {lang === "id"
                    ? "Izin diblokir. Aktifkan dari pengaturan browser."
                    : "Permission blocked. Enable it in browser settings."}
                </p>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
