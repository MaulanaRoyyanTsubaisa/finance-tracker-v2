import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { scheduleDailyReminder, getReminderSettings } from "./lib/reminder";

// Re-schedule daily reminder on app load if user previously enabled it
const reminderSettings = getReminderSettings();
if (reminderSettings.enabled && typeof Notification !== "undefined" && Notification.permission === "granted") {
  const lang = (localStorage.getItem("app-language") as "id" | "en") || "id";
  scheduleDailyReminder(lang);
}

createRoot(document.getElementById("root")!).render(<App />);
