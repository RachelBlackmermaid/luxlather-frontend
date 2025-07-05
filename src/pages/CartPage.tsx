// src/pages/CartPage.tsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { ChangeEvent } from 'react';
import useCartStore from "../store/useCartStore";
import { formatYen } from "../assets/utils/currency"            // global formatter

const CartPage = () => {
  /* -------------------------------------------------
   *  Select only the slices we need to minimise re-renders
   * ------------------------------------------------- */
  const cart           = useCartStore((s) => s.cart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart      = useCartStore((s) => s.clearCart);

  // derived values (functions) – call them once per render
  const totalItems          = useCartStore.getState().totalItems();
  const formattedTotalPrice = useCartStore.getState().formattedTotalPrice();

  const navigate = useNavigate();

  /* ------------ Set doc title on mount ------------ */
  useEffect(() => {
    document.title = "Your Cart – Essential Goods";
  }, []);

  /* ------------ Handlers ------------ */
  const handleQtyChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const value = Math.max(1, Number(e.target.value)); // prevent 0 / negatives
    updateQuantity(id, value);
  };

  const handleCheckout = () => {
    navigate("/checkout");
    // TODO: navigate to /checkout after Stripe integration
  };

  /* ------------ Empty Cart UI ------------ */
  if (cart.length === 0) {
    return (
      <section className="text-center py-20">
        <h2 className="text-3xl font-semibold mb-4">
          Your cart is empty! Add items 🛍️
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Go back shopping
        </button>
      </section>
    );
  }

  /* ------------ Main Cart UI ------------ */
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between bg-white p-4 shadow rounded-lg"
          >
            {/* Product thumbnail + name */}
            <div className="flex items-center gap-4">
              <img
                src={item.imageSrc}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h2 className="text-lg font-medium">{item.name}</h2>
                <p className="text-gray-600">{formatYen(item.price)}</p>
              </div>
            </div>

            {/* Quantity controls + remove */}
            <div className="flex items-center gap-3">
              <label htmlFor={`qty-${item._id}`} className="text-sm">
                Qty:
              </label>
              <input
                id={`qty-${item._id}`}
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => handleQtyChange(e, item._id)}
                className="w-16 border rounded px-2 py-1 text-center"
              />
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Totals & actions */}
      <div className="mt-10 text-right">
        <p className="text-xl font-semibold">
          Total ({totalItems} items): {formattedTotalPrice}
        </p>

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={clearCart}
            className="text-gray-600 hover:underline"
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary"
          >
            Checkout
          </button>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
