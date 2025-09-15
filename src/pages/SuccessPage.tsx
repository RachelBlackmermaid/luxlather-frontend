import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useCartStore from "../store/useCartStore";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id"); // from Stripe success_url
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    document.title = "Thank You - Order Confirmed";
    clearCart(); // clear cart on mount
  }, [clearCart]);

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-10">
      <h1 className="text-4xl font-bold text-green-600 mb-4">🎉 Thank You!</h1>
      <p className="text-lg mb-2">Your order was successful and your payment is confirmed.</p>
      {sessionId && (
        <p className="text-sm text-gray-600 mb-6">
          Order reference:&nbsp;
          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
            {sessionId}
          </span>
        </p>
      )}
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
