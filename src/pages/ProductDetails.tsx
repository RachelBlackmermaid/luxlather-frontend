import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import api from "../lib/api";
import useCartStore from "../store/useCartStore";

type Product = {
  _id: string;
  name: string;
  price: number;
  imageSrc: string;
  description: string;
  category: string;
};

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to laod product.");
        console.error(err);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        imageSrc: product.imageSrc,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    navigate("/cart");
  };

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;
  return (
    <section className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.imageSrc}
          alt={product.description}
          className="w-full md:w-1/2 object-cover rounded-lg shadow"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-bold mb-4">${product.price}</p>

          {/* Quantity selector */}

          <div className="flex items-center justify-center gap-3 mb-6">
            <label htmlFor="quantity" className="text-sm font-medium ">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 border rounded px-2 py-1 text-center"
            />
          </div>

          {/* Add to cart / Buy Now Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Add to Cart
            </button>

            <button
              className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-amber-300 transition hover:text-black"
              onClick={() => {
                handleBuyNow();
              }}
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
