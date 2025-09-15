import axios from "axios";

function normalizeBase(url?: string) {
  // default to local server if unset
  let base = (url || "http://localhost:5050").replace(/\/+$/, "");
  // append /api only if it isn't already there
  if (!/\/api$/i.test(base)) base += "/api";
  return base;
}

const api = axios.create({
  baseURL: normalizeBase(import.meta.env.VITE_API_URL),
  withCredentials: true, // needed for HttpOnly auth cookie
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
