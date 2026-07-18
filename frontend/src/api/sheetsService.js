import n8nClient from "@/api/axiosClient";
import env from "@/config/env";
import storage from "@/utils/storage";
import { STORAGE_KEYS } from "@/utils/constants";

/**
 * Sheets service -- logs assistant activity for auditing/analytics.
 *
 * Primary sink: Google Sheets, appended by n8n (see
 * n8n-workflows/save-to-sheets-workflow.json), with columns:
 *   User Question | Business Name | Phone Number | Time | Location | Status
 *
 * Fallback sink: localStorage, used when VITE_USE_LOCAL_STORAGE_FALLBACK
 * is enabled or when the n8n call fails, so the app keeps working during
 * local development/testing without a live n8n instance.
 */
export async function logAssistantActivity(entry) {
  const record = {
    userQuestion: entry.userQuestion ?? "",
    businessName: entry.businessName ?? "",
    phoneNumber: entry.phoneNumber ?? "",
    time: entry.time ?? new Date().toISOString(),
    location: entry.location ?? null,
    status: entry.status ?? "logged",
  };

  try {
    const { data } = await n8nClient.post(env.n8n.paths.saveLog, record);
    return { success: true, source: "google-sheets", data };
  } catch (error) {
    // Local-storage fallback keeps the feature usable in dev/testing,
    // matching the "Local Storage for testing" requirement in the spec.
    if (env.useLocalStorageFallback) {
      const existing = storage.get(STORAGE_KEYS.CHAT_SESSIONS + ":activity_log", []);
      const updated = [...existing, record];
      storage.set(STORAGE_KEYS.CHAT_SESSIONS + ":activity_log", updated);
      return { success: true, source: "local-storage", data: record, warning: error.message };
    }
    throw error;
  }
}

export function getLocalActivityLog() {
  return storage.get(STORAGE_KEYS.CHAT_SESSIONS + ":activity_log", []);
}
