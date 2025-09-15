import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const AdminLogin: React.FC = () => {
  const [identifier, setIdentifier] = useState(""); // email OR username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  // If already logged in as admin, bounce to /admin
  useEffect(() => {
    if (!loading && user?.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(identifier, password); // frontend auto-detects email vs username
      navigate("/admin");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Invalid login";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="p-8 shadow-md bg-white rounded w-96 space-y-4"
      >
        <h2 className="text-xl font-bold">🔐 Admin Login</h2>

        {error && <p className="text-red-500">{error}</p>}

        {/* Identifier: email OR username */}
        <input
          type="text"
          placeholder="Email or Username"
          className="border p-2 w-full rounded"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username email"
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Login"}
        </button>

        {/* Optional: fallback for env-admin if you kept /auth/admin/env-login
        <button
          type="button"
          onClick={async () => {
            try {
              await api.post("/auth/admin/env-login", {
                username: identifier,
                password,
              });
              window.location.href = "/admin";
            } catch (e) {
              setError("Env admin login failed");
            }
          }}
          className="w-full mt-2 border border-gray-300 py-2 rounded hover:bg-gray-50"
        >
          Use Env-Admin
        </button>
        */}
      </form>
    </section>
  );
};

export default AdminLogin;
