import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { useFinanceStore } from "@/lib/finance-store";
import Dashboard from "./pages/Dashboard";
import BudgetsPage from "./pages/BudgetsPage";
import AddPage from "./pages/AddPage";
import ReportsPage from "./pages/ReportsPage";
import AchievementsPage from "./pages/AchievementsPage";
import HistoryPage from "./pages/HistoryPage";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SettingsPage from "./pages/SettingsPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./pages/NotFound";
import { isOnboardingDone } from "./pages/OnboardingPage";
import { isGuestMode } from "./lib/guest";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <span className="text-5xl">🐱</span>
          <p className="text-sm text-muted-foreground font-medium mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isGuestMode()) {
    // Handle OAuth errors gracefully
    if (window.location.href.includes('error_description')) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
          <div className="text-center animate-fade-in max-w-sm">
            <img src="/logo.png" alt="DompetKu Logo" className="w-24 h-24 mx-auto drop-shadow-sm mb-4" />
            <h2 className="text-xl font-bold text-destructive mt-4 mb-2">Login Gagal</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Terjadi kesalahan dari server penyedia login (Google/Supabase). Mohon pastikan pengaturan Client Secret sudah benar.
            </p>
            <button 
              onClick={() => {
                window.location.href = '/auth';
              }}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      );
    }

    // Prevent redirecting if we are in the middle of a successful OAuth flow (token is in URL)
    if (window.location.hash.includes('access_token') || window.location.search.includes('code=')) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <img src="/logo.png" alt="DompetKu Logo" className="w-20 h-20 mx-auto animate-pulse" />
            <p className="text-sm text-muted-foreground font-medium mt-3">Authenticating...</p>
          </div>
        </div>
      );
    }
    if (!isOnboardingDone()) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const store = useFinanceStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <span className="text-5xl">🐱</span>
          <p className="text-sm text-muted-foreground font-medium mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  const guest = isGuestMode();
  const onboardingDone = isOnboardingDone();

  return (
    <Routes>
      <Route
        path="/onboarding"
        element={user || guest || onboardingDone ? <Navigate to="/" replace /> : <OnboardingPage />}
      />
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/" element={<ProtectedRoute><Dashboard store={store} /></ProtectedRoute>} />
      <Route path="/budgets" element={<ProtectedRoute><BudgetsPage store={store} /></ProtectedRoute>} />
      <Route path="/add" element={<ProtectedRoute><AddPage store={store} /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage store={store} /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryPage store={store} /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><AchievementsPage store={store} /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <BrowserRouter>
              <AuthProvider>
                <AppRoutes />
              </AuthProvider>
            </BrowserRouter>
          </CurrencyProvider>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
