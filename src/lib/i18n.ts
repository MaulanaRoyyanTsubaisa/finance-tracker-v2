export type Language = "id" | "en";

export const translations = {
  // Common
  loading: { id: "Loading...", en: "Loading..." },
  save: { id: "Simpan", en: "Save" },
  cancel: { id: "Batal", en: "Cancel" },
  delete: { id: "Hapus", en: "Delete" },
  back: { id: "Kembali", en: "Back" },
  
  // Auth
  welcomeBack: { id: "Welcome back~", en: "Welcome back~" },
  newHere: { id: "Hai, baru ya? 👋", en: "Hey, new here? 👋" },
  forgotTitle: { id: "Lupa Password? 🤔", en: "Forgot Password? 🤔" },
  loginSubtitle: { id: "Login dulu yuk biar datamu aman!", en: "Log in to keep your data safe!" },
  registerSubtitle: { id: "Daftar dulu biar bisa mulai tracking!", en: "Sign up to start tracking!" },
  forgotSubtitle: { id: "Masukkan email kamu, kami kirimkan link reset~", en: "Enter your email, we'll send a reset link~" },
  continueGoogle: { id: "Lanjut dengan Google", en: "Continue with Google" },
  or: { id: "atau", en: "or" },
  email: { id: "Email", en: "Email" },
  password: { id: "Password", en: "Password" },
  forgotPassword: { id: "Lupa password?", en: "Forgot password?" },
  login: { id: "Login 🚀", en: "Login 🚀" },
  register: { id: "Daftar 🎉", en: "Sign Up 🎉" },
  sendReset: { id: "Kirim Link Reset 📧", en: "Send Reset Link 📧" },
  noAccount: { id: "Belum punya akun? ", en: "Don't have an account? " },
  hasAccount: { id: "Sudah punya akun? ", en: "Already have an account? " },
  registerHere: { id: "Daftar di sini", en: "Sign up here" },
  loginHere: { id: "Login di sini", en: "Log in here" },
  backToLogin: { id: "Kembali ke Login", en: "Back to Login" },
  checkEmail: { id: "Cek email kamu untuk verifikasi ya~ 📧", en: "Check your email to verify~ 📧" },
  checkEmailReset: { id: "Cek email kamu untuk link reset password~ 📧", en: "Check your email for the reset link~ 📧" },
  loginSuccess: { id: "Login berhasil! 🎉", en: "Login successful! 🎉" },
  minChars: { id: "Min. 6 karakter", en: "Min. 6 characters" },

  // Reset Password
  resetPassword: { id: "Reset Password", en: "Reset Password" },
  newPassword: { id: "Password Baru", en: "New Password" },
  confirmPassword: { id: "Konfirmasi Password", en: "Confirm Password" },
  retypePassword: { id: "Ketik ulang password", en: "Retype password" },
  changePassword: { id: "Ubah Password 🔐", en: "Change Password 🔐" },
  passwordMismatch: { id: "Password tidak cocok!", en: "Passwords don't match!" },
  passwordMinLength: { id: "Password minimal 6 karakter", en: "Password must be at least 6 characters" },
  passwordChanged: { id: "Password berhasil diubah! 🎉", en: "Password changed successfully! 🎉" },
  passwordChangeFail: { id: "Gagal mengubah password", en: "Failed to change password" },
  enterNewPassword: { id: "Masukkan password baru kamu", en: "Enter your new password" },

  // Dashboard
  goodMorning: { id: "Good morning 👋", en: "Good morning 👋" },
  totalBalance: { id: "Total Saldo", en: "Total Balance" },
  income: { id: "Pemasukan", en: "Income" },
  expense: { id: "Pengeluaran", en: "Expense" },
  recentTransactions: { id: "Transaksi Terbaru", en: "Recent Transactions" },
  expenseBreakdown: { id: "Rincian Pengeluaran", en: "Expense Breakdown" },
  noDataYet: { id: "Belum ada data~", en: "No data yet~" },

  // Bottom Nav
  navHome: { id: "Beranda", en: "Home" },
  navBudget: { id: "Budget", en: "Budget" },
  navAdd: { id: "Tambah", en: "Add" },
  navHistory: { id: "Riwayat", en: "History" },
  navXp: { id: "XP", en: "XP" },

  // Add Transaction
  addTransaction: { id: "Tambah Transaksi", en: "Add Transaction" },
  expenseLabel: { id: "Pengeluaran 💸", en: "Expense 💸" },
  incomeLabel: { id: "Pemasukan 💰", en: "Income 💰" },
  amount: { id: "Nominal", en: "Amount" },
  category: { id: "Kategori", en: "Category" },
  date: { id: "Tanggal", en: "Date" },
  notes: { id: "Catatan", en: "Notes" },
  notesPlaceholder: { id: "cth: Makan siang bareng 🍕", en: "e.g., Lunch with friends 🍕" },
  addExpense: { id: "Tambah Pengeluaran 💸", en: "Add Expense 💸" },
  addIncome: { id: "Tambah Pemasukan 💰", en: "Add Income 💰" },
  custom: { id: "Custom", en: "Custom" },
  newCategoryName: { id: "Nama kategori baru", en: "New category name" },
  add: { id: "Tambah", en: "Add" },

  // Transaction List
  noTransactions: { id: "Belum ada transaksi nih~", en: "No transactions yet~" },
  startTracking: { id: "Yuk mulai catat keuanganmu!", en: "Start tracking your finances!" },

  // Budget
  budgetManager: { id: "Budget Manager 📊", en: "Budget Manager 📊" },
  trackSpending: { id: "Pantau pengeluaran per kategori~", en: "Track your spending per category~" },
  budgetDepleted: { id: "🚨 Budget habis!", en: "🚨 Budget depleted!" },
  budgetAlmost: { id: "⚠️ Hati-hati, hampir limit!", en: "⚠️ Watch out, almost at limit!" },

  // History
  historyTitle: { id: "Riwayat Transaksi 📋", en: "Transaction History 📋" },
  week: { id: "Minggu", en: "Week" },
  month: { id: "Bulan", en: "Month" },
  all: { id: "Semua", en: "All" },
  dateFilter: { id: "📅 Tanggal", en: "📅 Date" },
  pickDate: { id: "Pilih tanggal...", en: "Pick a date..." },
  previous: { id: "← Sebelumnya", en: "← Previous" },
  next: { id: "Berikutnya →", en: "Next →" },
  noTransactionsPeriod: { id: "Tidak ada transaksi di periode ini~", en: "No transactions in this period~" },
  nominal: { id: "Nominal", en: "Amount" },
  editDate: { id: "Tanggal", en: "Date" },
  editNotes: { id: "Catatan", en: "Notes" },

  // Achievements
  achievementsTitle: { id: "Achievements 🏆", en: "Achievements 🏆" },
  currentLevel: { id: "Level Saat Ini", en: "Current Level" },
  howToEarnXp: { id: "Cara Dapat XP ✨", en: "How to Earn XP ✨" },
  xpIncome: { id: "💰 Tambah pemasukan → +10 XP", en: "💰 Add income → +10 XP" },
  xpSmallExpense: { id: "🤏 Pengeluaran kecil (di bawah Rp100k) → +5 XP", en: "🤏 Small expense (under Rp100k) → +5 XP" },
  xpBudget: { id: "📊 Di bawah budget → +20 XP/minggu", en: "📊 Stay under budget → +20 XP/week" },
  badges: { id: "Lencana", en: "Badges" },
  earned: { id: "✓ Diraih", en: "✓ Earned" },

  // Badge names & descriptions
  badgeFirstStep: { id: "Langkah Pertama 🌱", en: "First Step 🌱" },
  badgeFirstStepDesc: { id: "Menambah transaksi pertama", en: "Added your first transaction" },
  badgeBudgetSetter: { id: "Pengatur Budget 📊", en: "Budget Setter 📊" },
  badgeBudgetSetterDesc: { id: "Mengatur budget pertama", en: "Set your first budget" },
  badgeSaverStreak: { id: "Hemat Beruntun 🔥", en: "Saver Streak 🔥" },
  badgeSaverStreakDesc: { id: "3 hari di bawah budget", en: "3 days under budget" },
  badgeMoneyMaster: { id: "Ahli Keuangan 👑", en: "Money Master 👑" },
  badgeMoneyMasterDesc: { id: "Mencapai level 3", en: "Reach level 3" },
  badgeZeroWaste: { id: "Tanpa Boros 🏆", en: "Zero Waste 🏆" },
  badgeZeroWasteDesc: { id: "Tidak boros selama sebulan", en: "No overspending for a month" },

  // Reports
  monthlyReport: { id: "Laporan Bulanan 📝", en: "Monthly Report 📝" },
  totalIncome: { id: "Total Pemasukan", en: "Total Income" },
  totalExpense: { id: "Total Pengeluaran", en: "Total Expense" },
  savings: { id: "Tabungan", en: "Savings" },
  savingsRate: { id: "tingkat tabungan", en: "savings rate" },
  realityCheck: { id: "Cek Realita 🪞", en: "Reality Check 🪞" },
  spendingByCategory: { id: "Pengeluaran per Kategori", en: "Spending by Category" },

  // Notification messages
  budgetDone: { id: "STOP. Budget {cat} sudah habis! 🚨", en: "STOP. {cat} budget is depleted! 🚨" },
  budgetAlmostGone: { id: "Hey… budget {cat} kamu almost gone 😭", en: "Hey… your {cat} budget is almost gone 😭" },
  budgetRunningLow: { id: "Budget {cat} kamu hampir habis 👀", en: "Your {cat} budget is running low 👀" },

  // XP Bar
  level: { id: "Level", en: "Level" },
  xpTo: { id: "XP menuju", en: "XP to" },

  // Language
  language: { id: "Bahasa", en: "Language" },

  // Theme
  darkMode: { id: "Mode Gelap", en: "Dark Mode" },
  lightMode: { id: "Mode Terang", en: "Light Mode" },

  // Export
  exportCSV: { id: "Export CSV", en: "Export CSV" },
  exportPDF: { id: "Export PDF", en: "Export PDF" },
  exportData: { id: "Export Data", en: "Export Data" },

  // Notifications
  noNotifications: { id: "Tidak ada notifikasi~", en: "No notifications~" },

  // Currency
  currency: { id: "Mata Uang", en: "Currency" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language, vars?: Record<string, string>): string {
  let text: string = translations[key]?.[lang] || translations[key]?.["en"] || key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
  }
  return text;
}
