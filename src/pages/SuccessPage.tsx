import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/useCartStore"; // ✅ import your Zustand store

const SuccessPage = () => {
  const navigate = useNavigate();
  const clearCart = useCartStore((s) => s.clearCart); // ✅ get the clearCart function

  useEffect(() => {
    document.title = "Thank You - Order Confirmed";
    clearCart(); // ✅ clear cart on mount
  }, [clearCart]);

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-10">
      <h1 className="text-4xl font-bold text-green-600 mb-4">🎉 Thank You!</h1>
      <p className="text-lg mb-6">
        Your order was successful. We've received your payment.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        Back to Home
      </button>
    </section>
  );
};

export default SuccessPage;
