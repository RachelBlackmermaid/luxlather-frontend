import { useEffect, useState } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";
import { priceForProduct, formatMoney } from "../lib/currency";

type Product = {
  _id: string;
  name: string;
  imageSrc?: string;
  description?: string;
  category: string;
  // pricing can come in different shapes;
  price?: number;                        // major units (virtual)
  priceCents?: number;                   // minor units
  prices?: Record<string, number>;       // per-currency minor units
};

type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
};

const OilPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOils = async () => {
      try {
        setLoading(true);
        const res = await api.get<Paginated<Product> | Product[]>("/products", {
          params: { category: "oil", page, pageSize, sort: "-createdAt" },
        });

        const data = res.data as any;
        if (Array.isArray(data)) {
          setProducts(data);
          setPages(1);
        } else {
          setProducts(data.items || []);
          setPages(data.pages || 1);
        }
      } catch (err) {
        setError("Failed to fetch oil products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOils();
  }, [page]);

  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="mb-10 text-4xl">Essential Oils</h2>
        {error && <p className="text-red-500">{error}</p>}
        {loading && <p>Loading…</p>}

        {!loading && (
          <>
            <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {products.map((p) => (
                <Link key={p._id} to={`/products/${p._id}`} className="group">
                  <img
                    src={p.imageSrc || "/placeholder.png"}
                    alt={p.description || p.name}
                    className="w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                  />
                  <h3 className="mt-4 text-sm text-gray-800">{p.name}</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {formatMoney(priceForProduct(p))}
                  </p>
                </Link>
              ))}
            </div>

            {/* Minimal pager */}
            {pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  className="px-3 py-1 rounded border disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Prev
                </button>
                <span className="text-sm">
                  Page {page} / {pages}
                </span>
                <button
                  className="px-3 py-1 rounded border disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page >= pages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default OilPage;
