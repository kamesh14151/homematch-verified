import { App as CapacitorApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

const NATIVE_AUTH_SCHEME = "com.rentverify.app";
const NATIVE_AUTH_HOST = "auth";
const NATIVE_AUTH_CALLBACK_PATH = "/callback";

export const NATIVE_AUTH_REDIRECT_URI = `${NATIVE_AUTH_SCHEME}://${NATIVE_AUTH_HOST}${NATIVE_AUTH_CALLBACK_PATH}`;

export const getOAuthRedirectUri = () => {
  if (Capacitor.isNativePlatform()) {
    return NATIVE_AUTH_REDIRECT_URI;
  }

  return window.location.origin;
};

export const signInWithGoogleOAuth = async () => {
  if (!Capacitor.isNativePlatform()) {
    return lovable.auth.signInWithOAuth("google", {
      redirect_uri: getOAuthRedirectUri(),
    });
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getOAuthRedirectUri(),
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    return { error };
  }

  if (data?.url) {
    await Browser.open({
      url: data.url,
      presentationStyle: "fullscreen",
    });
  }

  return { error: null };
};

export const handleNativeOAuthCallbackUrl = async (url: string) => {
  if (!url?.startsWith(`${NATIVE_AUTH_SCHEME}://`)) {
    return;
  }

  const parsedUrl = new URL(url);
  const isAuthCallback =
    parsedUrl.host === NATIVE_AUTH_HOST &&
    parsedUrl.pathname.startsWith(NATIVE_AUTH_CALLBACK_PATH);

  if (!isAuthCallback) {
    return;
  }

  const code = parsedUrl.searchParams.get("code");
  const errorDescription =
    parsedUrl.searchParams.get("error_description") ??
    parsedUrl.searchParams.get("error");

  if (errorDescription) {
    throw new Error(errorDescription);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      throw error;
    }
  } else {
    const hashParams = new URLSearchParams(parsedUrl.hash.replace(/^#/, ""));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) {
        throw error;
      }
    }
  }

  await Browser.close();
};

export const registerNativeOAuthListeners = () => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  const processUrl = async (url?: string) => {
    if (!url) {
      return;
    }

    try {
      await handleNativeOAuthCallbackUrl(url);
    } catch (error) {
      console.error("Native OAuth callback failed", error);
    }
  };

  void CapacitorApp.getLaunchUrl().then(({ url }) => {
    void processUrl(url);
  });

  void CapacitorApp.addListener("appUrlOpen", ({ url }) => {
    void processUrl(url);
  });
};
