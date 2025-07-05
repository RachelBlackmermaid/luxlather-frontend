import { useEffect, useState } from "react";
import api from "../lib/api";

//use general type file 
type Product = {
  _id: string;
  name: string;
  imageSrc: string,
  description: string;
  price: number;
  category: 'soap' | 'oil';
}

const SoapPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  //fetch soap on page load using useEffect
  useEffect(() => {
    const fetchSoap = async () => {
      try {
        const res = await api.get<Product[]>("/products", {
          params: {category:'soap'},
        });
        setProducts(res.data);
        
      } catch (err) {
        setError("Failed to fetch soap products");
        console.log(err);
        
        
      }
    };

    fetchSoap();
  }, []);



  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="mb-10 text-4xl">Shop Liquid Soap</h2>
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((p) => (
            <a key={p._id} href={`/products/${p._id}`} className="group">
              <img
                src={p.imageSrc}
                alt={p.description}
                className="w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
              />
              <h3 className="mt-4 text-sm text-gray-800">{p.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">
                ${p.price}
              </p>
            </a>

          ))}
        </div>
      </div>
    </section>
   
  )
}

export default SoapPage;