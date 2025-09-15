import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { formatMoney, getCurrency } from "../lib/currency";

type OrderItem = { productId?: string; name?: string; quantity?: number; priceCents?: number; };
type Order = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  items: OrderItem[];
  currency?: string;     // may exist
  totalCents?: number;   // may exist
  total?: number | string; // legacy fallback
  status?: "pending" | "paid" | "fulfilled" | "cancelled" | "refunded";
  createdAt: string;
};

type PageResp<T> = { items: T[]; total: number; page: number; pageSize: number; pages: number };

export default function AdminOrders() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  const [data, setData] = useState<PageResp<Order> | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "admin") nav("/admin-login", { replace: true });
  }, [user, loading, nav]);

  const fetchOrders = async () => {
    const { data } = await api.get<PageResp<Order>>("/orders", { params: { page, pageSize } });
    setData(data);
  };

  useEffect(() => { fetchOrders(); /* eslint-disable-next-line */ }, [page]);

  const updateStatus = async (id: string, status: NonNullable<Order["status"]>) => {
    await api.patch(`/orders/${id}/status`, { status });
    fetchOrders();
  };

  if (loading || !user || user.role !== "admin") return null;

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>

      <div className="overflow-x-auto bg-white border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Placed</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((o) => {
              const itemsCount = o.items?.reduce((s, it) => s + (it.quantity || 0), 0) || 0;
              const cur = (o.currency || getCurrency()).toUpperCase();
              const total =
                typeof o.totalCents === "number" ? o.totalCents / 100 :
                typeof o.total === "string" ? Number(o.total) :
                typeof o.total === "number" ? o.total : 0;

              return (
                <tr key={o._id} className="border-t">
                  <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="p-3">
                    <div className="font-medium">{o.name}</div>
                    <div className="text-gray-500">{o.email}</div>
                  </td>
                  <td className="p-3">{itemsCount}</td>
                  <td className="p-3">{formatMoney(total, cur)}</td>
                  <td className="p-3 capitalize">{o.status || "pending"}</td>
                  <td className="p-3">
                    <select
                      defaultValue={o.status || "pending"}
                      onChange={(e) => updateStatus(o._id, e.target.value as any)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="pending">pending</option>
                      <option value="paid">paid</option>
                      <option value="fulfilled">fulfilled</option>
                      <option value="cancelled">cancelled</option>
                      <option value="refunded">refunded</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data && data.pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button className="px-3 py-1 border rounded disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <span className="text-sm">Page {data.page} / {data.pages}</span>
          <button className="px-3 py-1 border rounded disabled:opacity-50"
                  disabled={page >= data.pages}
                  onClick={() => setPage((p) => Math.min(data.pages, p + 1))}>Next</button>
        </div>
      )}
    </section>
  );
}
