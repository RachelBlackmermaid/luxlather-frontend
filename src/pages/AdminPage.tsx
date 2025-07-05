import { useEffect, useState } from "react";
import api from "../lib/api";
import type { Product } from "../types/product";
import ProductForm from "../components/ProductForm";
import { motion, AnimatePresence } from "framer-motion";
import { PencilLine, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SCROLL_KEY = "luxlather-scroll-position";

const AdminPage = () => {

  const navigate = useNavigate();

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [oils, setOils] = useState<Product[]>([]);
  const [soaps, setSoaps] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<"oil" | "soap">("oil");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login");
    } else {
      setIsAuthChecked(true);
    }
  }, [navigate]);

 

  const fetchProducts = async () => {
    try {
      const [oilRes, soapRes] = await Promise.all([
        api.get("/products", { params: { category: "oil" } }),
        api.get("/products", { params: { category: "soap" } }),
      ]);

      setOils(oilRes.data);
      setSoaps(soapRes.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      setToastMessage("🗑️ Product deleted");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    const savedScroll = localStorage.getItem(SCROLL_KEY);
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll), behavior: "smooth" });
        localStorage.removeItem(SCROLL_KEY);
      }, 200);
    }
  }, []);
  if (!isAuthChecked) return null;

  return (
    <section className="p-8 max-w-5xl mx-auto">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow-lg z-50"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-end">
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/admin-login";
        }}
        className="ml-auto mb-4 text-xl text-primary font-bold hover:underline bg-gray-200 p-2 rounded-b-sm"
      >
        🔒 Logout
      </button>


      </div>
      

      <h2 className="text-3xl font-bold mb-6">🛠 Admin Dashboard</h2>

      {/* Tab Switch */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setActiveCategory("oil");
            setEditingProduct(null);
          }}
          className={`px-4 py-2 rounded ${
            activeCategory === "oil"
              ? "bg-black text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Oils
        </button>
        <button
          onClick={() => {
            setActiveCategory("soap");
            setEditingProduct(null);
          }}
          className={`px-4 py-2 rounded ${
            activeCategory === "soap"
              ? "bg-black text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Soaps
        </button>
      </div>

      {/* Form */}
      <ProductForm
        product={editingProduct}
        onSave={(message?: string) => {
          setEditingProduct(null);
          fetchProducts();
          if (message) {
            setToastMessage(message);
            setTimeout(() => setToastMessage(""), 3000);
          }
        }}
        defaultCategory={activeCategory}
      />

      {/* Products List */}
      <div className="mt-10 space-y-4">
        {(activeCategory === "oil" ? oils : soaps).map((p) => (
          <div
            key={p._id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-500">
                ${p.price} – {p.category}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  localStorage.setItem(SCROLL_KEY, window.scrollY.toString());
                  setEditingProduct(p);
                }}
                title="Edit"
                className="text-primary hover:text-secondary text-xl"
              >
                <PencilLine />
              </button>

              <button
                onClick={() => handleDelete(p._id)}
                title="Delete"
                className="text-gray-900 hover:text-gray-400 text-xl"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminPage;
