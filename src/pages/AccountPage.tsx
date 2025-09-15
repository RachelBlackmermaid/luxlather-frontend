import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect guests to login
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login?redirect=/account", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-600">Loading account…</div>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="bg-white border rounded p-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Name</span>
          <span className="font-medium">{user.name || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Email</span>
          <span className="font-medium">{(user as any).email || "—"}</span>
        </div>
        {"username" in user && (
          <div className="flex justify-between">
            <span className="text-gray-600">Username</span>
            <span className="font-medium">{(user as any).username || "—"}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Role</span>
          <span className="font-medium capitalize">{user.role || "customer"}</span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          to="/account/orders"
          className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800"
        >
          View My Orders
        </Link>
        <button
          onClick={logout}
          className="border px-5 py-2 rounded hover:bg-gray-50"
        >
          Log out
        </button>
      </div>
    </section>
  );
}
