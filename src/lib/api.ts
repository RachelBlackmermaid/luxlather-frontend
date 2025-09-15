// src/lib/api.ts
import axios from "axios";

/**
 * Normalize the base URL:
 * - default to local server
 * - strip trailing slashes
 * - ensure it contains a single `/api` segment (append if missing)
 */
function normalizeBase(input?: string) {
  let base = (input || "http://localhost:5050").replace(/\/+$/, "");
  try {
    const u = new URL(base);
    // If pathname doesn't already include /api as a distinct segment, append it
    if (!/(^|\/)api(\/|$)/i.test(u.pathname)) {
      u.pathname = u.pathname.replace(/\/+$/, "") + "/api";
    }
    // strip trailing slash from final string
    return u.toString().replace(/\/+$/, "");
  } catch {
    // Fallback for non-absolute inputs 
    if (!/(^|\/)api(\/|$)/i.test(base)) base += "/api";
    return base.replace(/\/+$/, "");
  }
}

const baseURL = normalizeBase(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL,
  withCredentials: true, // for HttpOnly cookies
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((cfg) => {
  if (cfg.url) {
    const isAbsolute = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(cfg.url);
    if (!isAbsolute) {
      cfg.url = cfg.url.replace(/^\/+/, ""); // make relative join safe
    }
  }

  if (import.meta.env.DEV) {
    // Debug final URL in dev
    try {
      const url = new URL(cfg.url || "", baseURL);
      // eslint-disable-next-line no-console
      console.debug("[API]", (cfg.method || "get").toUpperCase(), url.toString());
    } catch {
      // ignore
    }
  }
  return cfg;
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (import.meta.env.DEV && err?.response?.status === 404) {
      // eslint-disable-next-line no-console
      console.warn("[API 404]", err.config?.method?.toUpperCase(), err.config?.url, err.response?.data);
    }
    return Promise.reject(err);
  }
);

export default api;
