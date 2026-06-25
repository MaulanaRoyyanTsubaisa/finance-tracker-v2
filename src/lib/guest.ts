// ============= Guest mode + local storage helpers =============

const GUEST_KEY = "guest-mode";
const GUEST_TX = "guest-transactions";
const GUEST_BUDGETS = "guest-budgets";
const GUEST_XP = "guest-xp";
const GUEST_PROFILE = "guest-profile";

export const enableGuestMode = () => localStorage.setItem(GUEST_KEY, "1");
export const disableGuestMode = () => {
  localStorage.removeItem(GUEST_KEY);
};
export const isGuestMode = () => localStorage.getItem(GUEST_KEY) === "1";

// Generic helpers
const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

export interface GuestTx {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  notes: string;
}
export interface GuestBudget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}
export interface GuestProfile {
  display_name: string | null;
  avatar_url: string | null;
}

export const guestStore = {
  getTransactions: (): GuestTx[] => read<GuestTx[]>(GUEST_TX, []),
  setTransactions: (v: GuestTx[]) => write(GUEST_TX, v),

  getBudgets: (): GuestBudget[] => read<GuestBudget[]>(GUEST_BUDGETS, []),
  setBudgets: (v: GuestBudget[]) => write(GUEST_BUDGETS, v),

  getXp: (): number => read<number>(GUEST_XP, 0),
  setXp: (v: number) => write(GUEST_XP, v),

  getProfile: (): GuestProfile =>
    read<GuestProfile>(GUEST_PROFILE, { display_name: "Guest", avatar_url: null }),
  setProfile: (v: GuestProfile) => write(GUEST_PROFILE, v),

  clearAll: () => {
    localStorage.removeItem(GUEST_TX);
    localStorage.removeItem(GUEST_BUDGETS);
    localStorage.removeItem(GUEST_XP);
    localStorage.removeItem(GUEST_PROFILE);
  },
};

export const newId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
