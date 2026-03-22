"use client";

import { useEffect } from "react";

export function ThemeScript() {
  useEffect(() => {
    try {
      const themeCookie = document.cookie.match(/theme=([^;]+)/);
      if (themeCookie) {
        document.documentElement.setAttribute("data-theme", themeCookie[1]);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    } catch (e) {
      // Ignore errors
    }
  }, []);

  return null;
}
