/**
 * Merges class names, filtering out falsy values.
 * Drop-in alternative to clsx/classnames with no external dependencies.
 */
export function cn(...classes: (string | undefined | null | false | 0)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats a Date object (or ISO string / timestamp) into a human-readable string.
 * e.g. "Sunday, March 10, 2026"
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  locale: string = "en-GH",
): string {
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    throw new RangeError(`formatDate: invalid date value "${date}"`);
  }

  return new Intl.DateTimeFormat(locale, options).format(d);
}

/**
 * Formats a Date as a short date string.
 * e.g. "Mar 10, 2026"
 */
export function formatShortDate(date: Date | string | number, locale: string = "en-GH"): string {
  return formatDate(date, { year: "numeric", month: "short", day: "numeric" }, locale);
}

/**
 * Formats a Date as a time string.
 * e.g. "9:00 AM"
 */
export function formatTime(date: Date | string | number, locale: string = "en-GH"): string {
  return formatDate(date, { hour: "numeric", minute: "2-digit", hour12: true }, locale);
}

/**
 * Truncates a string to a maximum length, appending an ellipsis if truncated.
 */
export function truncate(str: string, maxLength: number, ellipsis = "…"): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - ellipsis.length).trimEnd() + ellipsis;
}

/**
 * Converts a string to a URL-friendly slug.
 * e.g. "Sunday Morning Service" → "sunday-morning-service"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Capitalises the first letter of each word.
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
}

/**
 * Returns true when running in a browser context.
 */
export const isBrowser = typeof window !== "undefined";
