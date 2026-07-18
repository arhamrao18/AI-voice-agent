/**
 * Small, pure formatting helpers used across components.
 */

/** Format an ISO/Date value as a short, human-friendly time (e.g. "2:41 PM"). */
export function formatTime(dateInput) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Format an ISO/Date value as a short date (e.g. "Jul 16, 2026"). */
export function formatDate(dateInput) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

/** Convert a distance in meters to a friendly "0.4 km" / "850 m" string. */
export function formatDistance(meters) {
  if (meters == null || Number.isNaN(meters)) return "—";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/** Truncate long text for previews (e.g. chat history sidebar). */
export function truncate(text, max = 48) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

/** Basic E.164-ish phone formatter for display purposes only. */
export function formatPhoneForDisplay(phone) {
  if (!phone) return "N/A";
  return phone;
}

/** Generate a reasonably unique id without extra dependencies. */
export function generateId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
