import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/auth";

const CustomerLogin: React.FC = () => {
  const { login, user, loading } = useAuth();
  const [identifier, setIdentifier] = useState(""); // email OR username
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // If already logged in, go to redirect or home
  useEffect(() => {
    if (!loading && user) {
      const redirect = params.get("redirect") || "/";
      navigate(redirect, { replace: true });
    }
  }, [user, loading, navigate, params]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(identifier, password);
      const redirect = params.get("redirect") || "/";
      navigate(redirect, { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Login failed";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Sign in</h1>
        {error && <p className="text-red-600">{error}</p>}

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
          {submitting ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-sm text-center text-gray-600">
          New here?{" "}
          <Link
            to={`/signup?redirect=${encodeURIComponent(params.get("redirect") || "/")}`}
            className="text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </section>
  );
};

export default CustomerLogin;
