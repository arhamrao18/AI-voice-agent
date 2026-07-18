import { NEARBY_BUSINESS_KEYWORDS } from "@/utils/constants";

/**
 * Very small, dependency-free intent detector used to decide whether a
 * chat message should be routed to the "nearby business" pipeline
 * (geolocation -> Places -> Gemini summary) instead of plain chat.
 *
 * Returns the matched intent string (e.g. "electrician") or null.
 * This is intentionally simple on the client; n8n can layer smarter
 * NLU/Gemini-based intent classification server-side if needed.
 */
export function detectNearbyBusinessIntent(text) {
  if (!text) return null;
  const lower = text.toLowerCase();

  for (const entry of NEARBY_BUSINESS_KEYWORDS) {
    if (entry.terms.some((term) => lower.includes(term))) {
      return entry.intent;
    }
  }
  return null;
}
