// Daily reminder using Browser Notification API + setTimeout scheduler.
// On native (Capacitor), this can be upgraded to @capacitor/local-notifications later.

const STORAGE_KEY = "daily-reminder";

export interface ReminderSettings {
  enabled: boolean;
  hour: number; // 0-23
  minute: number; // 0-59
}

export const DEFAULT_REMINDER: ReminderSettings = {
  enabled: false,
  hour: 20,
  minute: 0,
};

export function getReminderSettings(): ReminderSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_REMINDER;
    return { ...DEFAULT_REMINDER, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_REMINDER;
  }
}

export function saveReminderSettings(s: ReminderSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied";
  if (Notification.permission === "granted" || Notification.permission === "denied") {
    return Notification.permission;
  }
  return await Notification.requestPermission();
}

let timer: number | null = null;

function showNotification(lang: "id" | "en") {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const title = lang === "id" ? "🐱 Yuk catat pengeluaran!" : "🐱 Time to log your expenses!";
  const body = lang === "id"
    ? "Jangan lupa update transaksimu hari ini biar tetap on track ✨"
    : "Don't forget to log today's transactions to stay on track ✨";
  try {
    new Notification(title, { body, icon: "/favicon.ico", tag: "daily-reminder" });
  } catch (e) {
    console.warn("Notification failed:", e);
  }
}

function msUntilNext(hour: number, minute: number): number {
  const now = new Date();
  const next = new Date();
  next.setHours(hour, minute, 0, 0);
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime() - now.getTime();
}

export function scheduleDailyReminder(lang: "id" | "en" = "id") {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
  const s = getReminderSettings();
  if (!s.enabled) return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const delay = msUntilNext(s.hour, s.minute);
  timer = window.setTimeout(() => {
    showNotification(lang);
    // re-schedule for the next day
    scheduleDailyReminder(lang);
  }, delay);
}

export function cancelReminder() {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

export function testNotification(lang: "id" | "en" = "id") {
  showNotification(lang);
}
