/**
 * App-wide constants. Keep magic strings/numbers out of components.
 */

export const STORAGE_KEYS = {
  AUTH_TOKEN: "aipa_auth_token",
  AUTH_USER: "aipa_auth_user",
  CHAT_SESSIONS: "aipa_chat_sessions",
  SETTINGS: "aipa_settings",
};

export const MESSAGE_ROLE = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
};

export const MESSAGE_TYPE = {
  TEXT: "text",
  SOLUTIONS: "solutions",       // assistant offered exactly 3 solutions
  BUSINESS_RESULTS: "business_results",
  ERROR: "error",
};

export const SUGGESTED_PROMPTS = [
  { id: "sp-1", label: "Find nearby electricians", icon: "Zap" },
  { id: "sp-2", label: "Find nearby plumbers", icon: "Wrench" },
  { id: "sp-3", label: "Find nearby hospitals", icon: "Cross" },
  { id: "sp-4", label: "Find nearby restaurants", icon: "UtensilsCrossed" },
  { id: "sp-5", label: "Help me write a professional email", icon: "Mail" },
  { id: "sp-6", label: "Plan my day", icon: "CalendarCheck" },
];

// Keywords used for lightweight client-side intent detection before we
// decide whether to hit the "nearby business" pipeline instead of plain chat.
export const NEARBY_BUSINESS_KEYWORDS = [
  { intent: "electrician", terms: ["electrician", "electricians", "electrical"] },
  { intent: "plumber", terms: ["plumber", "plumbers", "plumbing"] },
  { intent: "hospital", terms: ["hospital", "hospitals", "clinic", "emergency room", "er"] },
  { intent: "restaurant", terms: ["restaurant", "restaurants", "food", "dinner", "lunch"] },
  { intent: "mechanic", terms: ["mechanic", "mechanics", "car repair"] },
  { intent: "locksmith", terms: ["locksmith", "locksmiths"] },
];

export const CALL_STATUS = {
  IDLE: "idle",
  DIALING: "dialing",
  CONNECTED: "connected",
  FAILED: "failed",
  COMPLETED: "completed",
};

export const APP_NAME = "Assistant";
