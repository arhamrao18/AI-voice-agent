import axios from "axios";
import env from "@/config/env";
import storage from "@/utils/storage";
import { STORAGE_KEYS } from "@/utils/constants";

/**
 * Single axios instance for all n8n webhook calls.
 *
 * Centralising the instance means:
 *  - One place to attach auth headers (JWT-ready for when Django lands).
 *  - One place to normalise error shapes for the whole app.
 *  - Easy to redirect traffic to a different base URL (e.g. Django) later
 *    by editing `env.js` only.
 */
const n8nClient = axios.create({
  baseURL: env.n8n.baseUrl,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
    // Required when n8n is exposed via an ngrok free-tier tunnel: without
    // this header, ngrok serves an HTML "browser warning" interstitial
    // instead of forwarding the request to n8n, which breaks every call.
    // Harmless (ignored) against non-ngrok hosts, so it's safe to leave on.
    "ngrok-skip-browser-warning": "true",
  },
});

// Attach auth token (future-JWT-ready) to every outgoing request, if present.
n8nClient.interceptors.request.use((config) => {
  const token = storage.get(STORAGE_KEYS.AUTH_TOKEN, null);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalise error responses so components only ever deal with
// { message, status, details } instead of raw axios error shapes.
n8nClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? null;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong while talking to the assistant service.";
    const normalised = {
      message,
      status,
      details: error.response?.data ?? null,
      isNetworkError: !error.response,
    };
    return Promise.reject(normalised);
  }
);

export default n8nClient;

/**
 * Placeholder client for the future Django REST Framework backend.
 * Kept separate on purpose: when Django is introduced, features can be
 * migrated one service at a time by pointing that service at
 * `djangoClient` instead of `n8nClient`, with zero changes to hooks/UI.
 */
export const djangoClient = axios.create({
  baseURL: env.django.baseUrl,
  timeout: 120000,
  headers: { "Content-Type": "application/json" },
});