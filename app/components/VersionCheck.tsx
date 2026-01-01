"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const VERSION_KEY = "nyasakura:app_version";
const RELOADED_FOR_KEY = "nyasakura:app_version_reloaded_for";

async function clearFrontendCaches() {
  try {
    if (typeof window !== "undefined" && "caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {
    // ignore
  }

  try {
    if (
      typeof navigator !== "undefined" &&
      "serviceWorker" in navigator &&
      navigator.serviceWorker.getRegistrations
    ) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
  } catch {
    // ignore
  }
}

export function VersionCheck() {
  const pathname = usePathname();

  useEffect(() => {
    const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || "dev";

    // Always print current frontend version in DevTools console.
    // (Requirement: "在f12控制台输出当前前端版本号")
    console.info(`[NyaSakura] Frontend version: ${currentVersion}`);

    try {
      const cachedVersion = localStorage.getItem(VERSION_KEY);
      const reloadedFor = sessionStorage.getItem(RELOADED_FOR_KEY);

      if (!cachedVersion) {
        localStorage.setItem(VERSION_KEY, currentVersion);
        return;
      }

      if (cachedVersion !== currentVersion) {
        // Prevent infinite reload loops within the same tab session.
        if (reloadedFor === currentVersion) {
          localStorage.setItem(VERSION_KEY, currentVersion);
          return;
        }

        sessionStorage.setItem(RELOADED_FOR_KEY, currentVersion);
        localStorage.setItem(VERSION_KEY, currentVersion);

        void clearFrontendCaches().finally(() => {
          // Trigger a reload after clearing caches so updated assets are fetched.
          window.location.reload();
        });
      }
    } catch {
      // localStorage/sessionStorage may be blocked; fail silently.
    }
  }, [pathname]);

  return null;
}
