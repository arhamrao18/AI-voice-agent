import storage from "@/utils/storage";
import { STORAGE_KEYS } from "@/utils/constants";
import { generateId } from "@/utils/formatters";

/**
 * Auth service -- SIMPLE, front-end-only authentication for now.
 *
 * This intentionally mimics the shape of a real JWT-based flow
 * (login returns a token + user, logout clears them, a "me" getter
 * reads the current session) so that swapping this for real calls to
 * a Django REST Framework `/api/auth/*` endpoint later is a drop-in
 * replacement -- only this file changes, not the components/hooks
 * that consume `useAuth`.
 */

const FAKE_LATENCY_MS = 400;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login({ email, password }) {
  await delay(FAKE_LATENCY_MS);

  // NOTE: replace this block with a real POST to Django/n8n once the
  // backend is available. Any non-empty email/password succeeds today
  // so the UI/UX can be fully exercised without a backend dependency.
  if (!email || !password) {
    throw { message: "Email and password are required.", status: 400 };
  }

  const fakeToken = `local.${generateId("jwt")}`;
  const user = {
    id: generateId("user"),
    name: email.split("@")[0].replace(/[._]/g, " "),
    email,
    avatarInitials: email.slice(0, 2).toUpperCase(),
    phoneNumber: "",
    createdAt: new Date().toISOString(),
  };

  storage.set(STORAGE_KEYS.AUTH_TOKEN, fakeToken);
  storage.set(STORAGE_KEYS.AUTH_USER, user);

  return { token: fakeToken, user };
}

export async function logout() {
  await delay(150);
  storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  storage.remove(STORAGE_KEYS.AUTH_USER);
  return true;
}

export function getCurrentUser() {
  return storage.get(STORAGE_KEYS.AUTH_USER, null);
}

export function getToken() {
  return storage.get(STORAGE_KEYS.AUTH_TOKEN, null);
}

export function isAuthenticated() {
  return !!getToken();
}

export async function updateProfile(updates) {
  await delay(250);
  const current = getCurrentUser() || {};
  const updated = { ...current, ...updates };
  storage.set(STORAGE_KEYS.AUTH_USER, updated);
  return updated;
}
