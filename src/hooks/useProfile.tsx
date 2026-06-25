import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isGuestMode, guestStore } from "@/lib/guest";

export interface ProfileData {
  display_name: string | null;
  avatar_url: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({ display_name: null, avatar_url: null });

  useEffect(() => {
    if (isGuestMode()) {
      const p = guestStore.getProfile();
      setProfile(p);

      // Listen to local storage changes (cross-tab) and a custom event for same-tab
      const onStorage = (e: StorageEvent) => {
        if (e.key === "guest-profile") setProfile(guestStore.getProfile());
      };
      const onLocal = () => setProfile(guestStore.getProfile());
      window.addEventListener("storage", onStorage);
      window.addEventListener("guest-profile-updated", onLocal);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("guest-profile-updated", onLocal);
      };
    }

    if (!user) {
      setProfile({ display_name: null, avatar_url: null });
      return;
    }

    let cancelled = false;
    const load = () => {
      supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (!cancelled && data) {
            setProfile({ display_name: data.display_name, avatar_url: data.avatar_url });
          }
        });
    };
    load();

    const channel = supabase
      .channel(`profile-${user.id}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const row = payload.new as { display_name?: string | null; avatar_url?: string | null } | null;
          if (row) {
            setProfile({ display_name: row.display_name ?? null, avatar_url: row.avatar_url ?? null });
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user]);

  const initials = (profile.display_name || user?.user_metadata?.full_name || user?.email || "?")
    .toString()
    .trim()
    .charAt(0)
    .toUpperCase();

  return { profile, initials };
}
