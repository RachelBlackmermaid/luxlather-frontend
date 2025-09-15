import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/auth";

type ContactMsg = {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "resolved";
  createdAt: string;
};

type PageResp<T> = { items: T[]; total: number; page: number; pageSize: number; pages: number };

export default function AdminContactInbox() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  const [data, setData] = useState<PageResp<ContactMsg> | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [status, setStatus] = useState<string>(""); // filter

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "admin") nav("/admin-login", { replace: true });
  }, [user, loading, nav]);

  const fetchMsgs = async () => {
    const { data } = await api.get<PageResp<ContactMsg>>("/contact", {
      params: { page, pageSize, ...(status ? { status } : {}) },
    });
    setData(data);
  };

  useEffect(() => { fetchMsgs(); /* eslint-disable-next-line */ }, [page, status]);

  const updateStatus = async (id: string, next: ContactMsg["status"]) => {
    await api.patch(`/contact/${id}/status`, { status: next });
    fetchMsgs();
  };

  if (loading || !user || user.role !== "admin") return null;

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Contact Inbox</h1>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border rounded px-3 py-1"
        >
          <option value="">All</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-3">
        {data?.items.map((m) => (
          <div key={m._id} className="border rounded p-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="font-medium">{m.name} <span className="text-gray-500">({m.email})</span></div>
              <span className="text-xs px-2 py-1 rounded bg-gray-100">{m.status}</span>
            </div>
            <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
              {m.message.length > 500 ? m.message.slice(0, 500) + "…" : m.message}
            </p>
            <div className="mt-3 text-xs text-gray-500">
              {new Date(m.createdAt).toLocaleString()}
            </div>
            <div className="mt-3 flex gap-2">
              {m.status !== "read" && (
                <button className="px-3 py-1 border rounded" onClick={() => updateStatus(m._id, "read")}>
                  Mark as read
                </button>
              )}
              {m.status !== "resolved" && (
                <button className="px-3 py-1 border rounded" onClick={() => updateStatus(m._id, "resolved")}>
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {data && data.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <span className="text-sm">Page {data.page} / {data.pages}</span>
          <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={page >= data.pages}
                  onClick={() => setPage((p) => Math.min(data.pages, p + 1))}>Next</button>
        </div>
      )}
    </section>
  );
}
