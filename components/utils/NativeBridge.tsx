"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { usePathname, useRouter } from "next/navigation";

export default function NativeBridge() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only run on native platforms (Android/iOS)
    if (!Capacitor.isNativePlatform()) return;

    // 1. Initialize Status Bar
    const initStatusBar = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: "#FAF9F6" }); // Match archival paper
      } catch (e) {
        console.warn("StatusBar not available", e);
      }
    };
    initStatusBar();

    // 2. Handle Android Back Button
    const setupBackButton = async () => {
      const listener = await App.addListener("backButton", (data) => {
        // If we are on the home page (root of the app surface), we can let the app exit
        // or minimize. Capacitor's default behavior is often fine, but we can customize.
        
        // Check if we can go back in history
        if (window.history.length > 1) {
          window.history.back();
        } else {
          // If no more history, minimize the app
          App.minimizeApp();
        }
      });

      return () => {
        listener.remove();
      };
    };

    setupBackButton();
  }, [pathname, router]);

  return null; // This component doesn't render anything
}
