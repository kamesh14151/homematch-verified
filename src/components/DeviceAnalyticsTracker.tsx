import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type DeviceType = "desktop" | "mobile" | "tablet";

function detectDeviceType(): DeviceType {
  const width = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();

  if (/ipad|tablet/.test(ua) || (width >= 768 && width < 1024)) {
    return "tablet";
  }

  if (/mobi|android|iphone/.test(ua) || width < 768) {
    return "mobile";
  }

  return "desktop";
}

function getSessionId() {
  const key = "rv_analytics_session_id";
  const existing = sessionStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  sessionStorage.setItem(key, generated);
  return generated;
}

export function DeviceAnalyticsTracker() {
  const location = useLocation();
  const { user } = useAuth();

  const sessionId = useMemo(() => getSessionId(), []);

  useEffect(() => {
    const routeKey = `${location.pathname}${location.search}`;
    const dedupeKey = `rv_last_analytics_route`;
    const previousRoute = sessionStorage.getItem(dedupeKey);

    if (previousRoute === routeKey) {
      return;
    }

    sessionStorage.setItem(dedupeKey, routeKey);

    const run = async () => {
      const deviceType = detectDeviceType();

      await supabase.from("analytics_pageviews").insert({
        path: routeKey,
        device_type: deviceType,
        session_id: sessionId,
        referrer: document.referrer || null,
        user_id: user?.id ?? null,
      });
    };

    void run();
  }, [location.pathname, location.search, sessionId, user?.id]);

  return null;
}
