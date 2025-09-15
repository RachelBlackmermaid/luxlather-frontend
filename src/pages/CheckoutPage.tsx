import { z } from "zod";
import React, { useState } from "react";
import useCartStore from "../store/useCartStore";
import api from "../lib/api";
import { formatMoney, getCurrency } from "../lib/currency";

// Zod schema
const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(8, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;
type StripeSessionResponse = { id: string; url: string };

const CheckoutPage: React.FC = () => {
  const cart = useCartStore((s) => s.cart);
  const toApiItems =
    // use helper if your store has it, else fallback
    (useCartStore.getState().toApiItems?.bind(useCartStore.getState())) ||
    (() => cart.map((i) => ({ productId: i._id, quantity: i.quantity })));

  const total = cart.reduce((sum, item) => sum + item.quantity * (Number(item.price) || 0), 0);
  const formattedTotal = formatMoney(total);

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
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleStripePayment = async () => {
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message;
      setError(firstError || "Invalid input");
      return;
    }
    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const currency = getCurrency(); // UGX by default (can be KES/RWF/TZS/JPY/USD/EUR)
      const payload = {
        items: toApiItems(),
        currency,
        customer: form,
      };

      const { data } = await api.post<StripeSessionResponse>("/checkout/session", payload);
      if (data?.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        throw new Error("Stripe session URL missing");
      }
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to start payment. Please try again!";
      setError(msg);
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
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full disabled:opacity-60"
        >
          {loading ? "Redirecting..." : `Pay – ${formattedTotal}`}
        </button>
      </div>
    </section>
  );
};

export default CheckoutPage;
