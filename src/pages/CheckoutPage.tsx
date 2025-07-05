import { z } from "zod";
import React, { useState } from "react";
import useCartStore from "../store/useCartStore";
import { formatYen } from "../assets/utils/currency";
import axios from "axios";

// Zod schema
const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(8, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const cart = useCartStore((s) => s.cart);

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const formattedTotal = formatYen(total);

  const [form, setForm] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStripePayment = async () => {
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message;
      setError(firstError || "Invalid input");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await axios.post<{ url: string }>(
        `${import.meta.env.VITE_API_URL}/checkout/create-session`,
        {
          customer: form,
          items: cart,
        }
      );

      if (res.data.url) {
        window.location.href = res.data.url; // Redirect to Stripe
      } else {
        throw new Error("Stripe session URL missing");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to start payment. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="space-y-6">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full border p-2 rounded"
        />

        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Delivery Address"
          className="w-full border p-2 rounded h-24"
        />

        <button
          onClick={handleStripePayment}
          disabled={loading || cart.length === 0}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
        >
          {loading ? "Redirecting..." : `Pay – ${formattedTotal}`}
        </button>
      </div>
    </section>
  );
};

export default CheckoutPage;
