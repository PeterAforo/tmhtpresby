/**
 * Theme utilities for light / dark mode.
 *
 * Theme preference is persisted in a cookie so that it is available
 * server-side (no flash-of-incorrect-theme), and also applied as a
 * `data-theme` attribute on <html> so Tailwind / CSS variables respond
 * immediately in the browser.
 */

export type Theme = "light" | "dark";

const THEME_COOKIE = "theme";
const THEME_ATTRIBUTE = "data-theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// ---------------------------------------------------------------------------
// Cookie helpers (browser-safe)
// ---------------------------------------------------------------------------

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=")[1]) : undefined;
}

function setCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === "undefined") return;

  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    `max-age=${maxAge}`,
    "path=/",
    "SameSite=Lax",
  ].join("; ");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the current theme.
 *
 * Priority: cookie → system preference → "light"
 */
export function getTheme(): Theme {
  // 1. Explicit user preference stored in cookie
  const stored = getCookie(THEME_COOKIE);
  if (stored === "dark" || stored === "light") return stored;

  // 2. OS / browser preference
  if (typeof window !== "undefined" && window.matchMedia) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }

  // 3. Default
  return "light";
}

/**
 * Sets the theme cookie and updates the `data-theme` attribute on <html>.
 * Safe to call on the server (cookie write is skipped).
 */
export function setTheme(theme: Theme): void {
  setCookie(THEME_COOKIE, theme, COOKIE_MAX_AGE);

  if (typeof document !== "undefined") {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);

    // Keep the Tailwind `dark` class strategy in sync if needed
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}

/**
 * Toggles between light and dark, persisting the new value.
 * Returns the new theme.
 */
export function toggleTheme(): Theme {
  const current = getTheme();
  const next: Theme = current === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

/**
 * Reads the theme from a `Cookie` header string (server-side).
 * Useful inside Next.js Server Components / Route Handlers.
 *
 * @example
 * const theme = getThemeFromCookieHeader(request.headers.get("cookie") ?? "");
 */
export function getThemeFromCookieHeader(cookieHeader: string): Theme {
  const match = cookieHeader
    .split("; ")
    .find((row) => row.startsWith(`${THEME_COOKIE}=`));

  const value = match ? decodeURIComponent(match.split("=")[1]) : undefined;
  return value === "dark" || value === "light" ? value : "light";
}

/**
 * Inline script string that can be injected into <head> (before any JS
 * bundle loads) to prevent a flash of incorrect theme.
 *
 * Usage in layout.tsx:
 *   <script dangerouslySetInnerHTML={{ __html: themeScript }} />
 */
export const themeScript = `(function(){
  try {
    var c = document.cookie.split('; ').find(function(r){return r.startsWith('${THEME_COOKIE}=');});
    var t = c ? decodeURIComponent(c.split('=')[1]) : null;
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('${THEME_ATTRIBUTE}', t);
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch(e){}
})();`;
