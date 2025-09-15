import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import useCartStore from "../store/useCartStore";
import { priceForProduct, formatMoney } from "../lib/currency";

type Product = {
  _id: string;
  name: string;
  imageSrc?: string;
  description?: string;
  category: string;
  // pricing may come in any of these shapes from the API
  price?: number;                        // major units (virtual)
  priceCents?: number;                   // minor units
  prices?: Record<string, number>;       // per-currency minor units
};

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get<Product>(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to load product.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const unitPrice = priceForProduct(product); // major units for display only
    addToCart(
      {
        _id: product._id,
        name: product.name,
        price: unitPrice,
        imageSrc: product.imageSrc || "",
      },
      Math.max(1, Math.trunc(quantity) || 1)
    );
  };

  const handleBuyNow = () => navigate("/cart");

  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (loading || !product) return <p className="p-8">Loading...</p>;

  const displayPrice = formatMoney(priceForProduct(product));

  return (
    <section className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.imageSrc || "/placeholder.png"}
          alt={product.description || product.name}
          className="w-full md:w-1/2 object-cover rounded-lg shadow"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-bold mb-4">{displayPrice}</p>

          {/* Quantity selector */}
          <div className="flex items-center gap-3 mb-6">
            <label htmlFor="quantity" className="text-sm font-medium">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              min={1}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Math.trunc(Number(e.target.value) || 1)))
              }
              className="w-16 border rounded px-2 py-1 text-center"
            />
          </div>

          {/* Add to cart / Buy Now Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Add to Cart
            </button>

            <button
              className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-amber-300 transition hover:text-black"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
