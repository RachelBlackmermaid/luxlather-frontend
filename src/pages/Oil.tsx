import { useEffect, useState } from "react";
import api from "../lib/api.ts";
import { Link } from "react-router-dom";

type Product = {
  _id: string;
  name: string;
  imageSrc: string;
  description: string;
  price: number;
  category: string;
};

const OilPage = () => {
  //state to store oils fetched from backend
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  //fetch oils on page load using useEffect
  useEffect(() => {
    const fetchOils = async () => {
      try {
        const res = await api.get<Product[]>("/products", {
          params: { category: "oil" },
        });
        setProducts(res.data);
      } catch (err) {
        setError("Failed to fetch oil products.");
        console.error(err);
      }
    };

    fetchOils();
  }, []);

  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="mb-10 text-4xl">Essential Oils</h2>
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((p) => (
            <Link key={p._id} to={`/products/${p._id}`} className="group">
              <img
                src={p.imageSrc}
                alt={p.description}
                className="w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
              />
              <h3 className="mt-4 text-sm text-gray-800">{p.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">
                ${p.price}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OilPage;
