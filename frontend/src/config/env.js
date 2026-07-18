/**
 * Centralised environment configuration.
 * Every environment variable used by the app is read here ONCE so that:
 *  - Typos in `import.meta.env.VITE_...` only happen in one place.
 *  - Sensible fallbacks exist for local development.
 *  - Swapping n8n for the future Django backend only touches this file
 *    plus the relevant service in `src/api`.
 */
const env = {
  n8n: {
    baseUrl: import.meta.env.VITE_N8N_BASE_URL || "http://localhost:5678/webhook",
    // Single endpoint. The n8n workflow behind it uses OpenAI function-calling
    // to decide, per message, whether to just reply, search nearby businesses
    // (Google Places), or place a Twilio call — the frontend no longer needs
    // to know or choose which "feature" a message belongs to.
    chatPath: import.meta.env.VITE_N8N_CHAT_PATH || "/assistant/chat",
  },
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  django: {
    baseUrl: import.meta.env.VITE_DJANGO_API_BASE_URL || "http://localhost:8000/api",
  },
  useLocalStorageFallback: (import.meta.env.VITE_USE_LOCAL_STORAGE_FALLBACK ?? "true") === "true",
};

export default env;
