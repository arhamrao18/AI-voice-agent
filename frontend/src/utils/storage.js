/**
 * Thin wrapper around localStorage.
 *
 * The product spec calls for "Local Storage for testing" as a storage
 * backend alongside Google Sheets. This module is the single place that
 * touches `window.localStorage` so it can later be swapped for an
 * IndexedDB layer or removed once the Django backend owns persistence,
 * without touching call sites.
 */

const isBrowser = typeof window !== "undefined" && !!window.localStorage;

function get(key, fallback = null) {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.error(`[storage] Failed to read key "${key}"`, error);
    return fallback;
  }
}

function set(key, value) {
  if (!isBrowser) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[storage] Failed to write key "${key}"`, error);
    return false;
  }
}

function remove(key) {
  if (!isBrowser) return;
  window.localStorage.removeItem(key);
}

function clearAll() {
  if (!isBrowser) return;
  window.localStorage.clear();
}

const storage = { get, set, remove, clearAll };

export default storage;
