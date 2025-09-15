import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/auth";
import { formatMoney, getCurrency } from "../lib/currency";

type OrderItem = {
  name?: string;
  quantity?: number;
  priceCents?: number;
  lineTotalCents?: number;
};

type Order = {
  _id: string;
  createdAt: string;
  status?: "pending" | "paid" | "fulfilled" | "cancelled" | "refunded";
  currency?: string;
  totalCents?: number;
  total?: number | string;
  items: OrderItem[];
};

type PageResp<T> = {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
  orders: T[];
};

export default function MyOrders() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<PageResp<Order> | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [error, setError] = useState("");

  // Require login
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login?redirect=/account/orders", { replace: true });
    }
  }, [user, loading, navigate]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get<PageResp<Order>>("/orders/mine", {
        params: { page, pageSize },
      });
      setData(data);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to load orders");
    }
  };

  useEffect(() => {
    if (!loading && user) fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, user, loading]);

  if (loading || !user) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-600">Loading your orders…</div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!data || data.orders.length === 0 ? (
        <div className="bg-white border rounded p-8 text-center">
          <p className="text-gray-700">No orders yet.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-black text-white px-5 py-2 rounded hover:bg-gray-800"
          >
            Start shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.orders.map((o) => {
            const cur = (o.currency || getCurrency()).toUpperCase();
            const total =
              typeof o.totalCents === "number"
                ? o.totalCents / 100
                : typeof o.total === "string"
                ? Number(o.total)
                : typeof o.total === "number"
                ? o.total
                : 0;

            return (
              <div key={o._id} className="bg-white border rounded p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="text-sm text-gray-600">
                    Placed:{" "}
                    <span className="font-medium">
                      {new Date(o.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    Status:{" "}
                    <span className="px-2 py-0.5 rounded bg-gray-100 capitalize">
                      {o.status || "pending"}
                    </span>
                  </div>
                  <div className="text-sm font-semibold">
                    Total: {formatMoney(total, cur)}
                  </div>
                </div>

                <ul className="mt-4 divide-y">
                  {o.items?.map((it, idx) => (
                    <li key={idx} className="py-2 flex items-center justify-between text-sm">
                      <span className="text-gray-800">
                        {it.name || "Item"} × {it.quantity || 1}
                      </span>
                      {typeof it.lineTotalCents === "number" ? (
                        <span className="text-gray-700">
                          {formatMoney(it.lineTotalCents / 100, cur)}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {data && data.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span className="text-sm">
            Page {data.page} / {data.pages}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page >= data.pages}
            onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
