import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/auth";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email"),
  username: z.string().trim().min(3, "Min 3 characters").max(30).optional().or(z.literal("")),
  password: z.string().min(6, "Min 6 characters"),
  confirm: z.string().min(6, "Confirm your password"),
}).refine((data) => data.password === data.confirm, {
  path: ["confirm"],
  message: "Passwords do not match",
});

type FormData = z.infer<typeof schema>;

const CustomerSignup: React.FC = () => {
  const { signup, user, loading } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    username: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // If already logged in, bounce away
  useEffect(() => {
    if (!loading && user) {
      const redirect = params.get("redirect") || "/";
      navigate(redirect, { replace: true });
    }
  }, [user, loading, navigate, params]);

  const onChange =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((m) => ({ ...m, [key]: "" }));
      setServerError("");
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const map: Partial<Record<keyof FormData, string>> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0] as keyof FormData;
        map[path] = issue.message;
      }
      setErrors(map);
      return;
    }

    setSubmitting(true);
    setServerError("");
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        username: form.username || undefined,
      });
      const redirect = params.get("redirect") || "/";
      navigate(redirect, { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Signup failed";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Create account</h1>

        {serverError && <p className="text-red-600">{serverError}</p>}

        <input
          type="text"
          placeholder="Full name"
          className={`border p-2 w-full rounded ${errors.name ? "border-red-500" : ""}`}
          value={form.name}
          onChange={onChange("name")}
          autoComplete="name"
          required
        />
        {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}

        <input
          type="email"
          placeholder="Email"
          className={`border p-2 w-full rounded ${errors.email ? "border-red-500" : ""}`}
          value={form.email}
          onChange={onChange("email")}
          autoComplete="email"
          required
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}

        <input
          type="text"
          placeholder="Username (optional)"
          className={`border p-2 w-full rounded ${errors.username ? "border-red-500" : ""}`}
          value={form.username}
          onChange={onChange("username")}
          autoComplete="username"
        />
        {errors.username && <p className="text-xs text-red-600">{errors.username}</p>}

        <input
          type="password"
          placeholder="Password"
          className={`border p-2 w-full rounded ${errors.password ? "border-red-500" : ""}`}
          value={form.password}
          onChange={onChange("password")}
          autoComplete="new-password"
          required
        />
        {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}

        <input
          type="password"
          placeholder="Confirm password"
          className={`border p-2 w-full rounded ${errors.confirm ? "border-red-500" : ""}`}
          value={form.confirm}
          onChange={onChange("confirm")}
          autoComplete="new-password"
          required
        />
        {errors.confirm && <p className="text-xs text-red-600">{errors.confirm}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to={`/login?redirect=${encodeURIComponent(params.get("redirect") || "/")}`}
            className="text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </section>
  );
};

export default CustomerSignup;
