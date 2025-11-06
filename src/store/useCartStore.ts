import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import toast from "react-hot-toast";


export type CartItem = {
  _id: string;          // productId in DB
  name: string;
  price: number;        
  imageSrc: string;
  quantity: number;
};

type CartState = {
  cart: CartItem[];

  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // computed
  totalItems: () => number;
  totalPrice: () => number;
  formattedTotalPrice: () => string;

  // helper for API payloads (backend expects productId + quantity)
  toApiItems: () => { productId: string; quantity: number }[];
};

/* Currency formatting (supports ENV override) */
const ENV_CCY = (import.meta.env.VITE_DEFAULT_CURRENCY || "USD").toUpperCase();

const formatCurrency = (amount: number) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: ENV_CCY,
    }).format(amount);
  } catch (err) {
    console.warn("Currency formatting failed, falling back to USD:", err);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }
};


const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],

        addToCart: (item, quantity) => {
          const qty = Math.max(1, Math.trunc(Number(quantity) || 1));
          const cart = get().cart;
          const existing = cart.find((i) => i._id === item._id);

          if (existing) {
            set(
              {
                cart: cart.map((i) =>
                  i._id === item._id ? { ...i, quantity: i.quantity + qty } : i
                ),
              },
              false,
              "cart/addQuantity"
            );
            toast.success(`Updated quantity × ${qty}`);
          } else {
            set(
              { cart: [...cart, { ...item, quantity: qty }] },
              false,
              "cart/addItem"
            );
            toast.success(`${item.name} added to cart`);
          }
        },

        removeFromCart: (id) => {
          const item = get().cart.find((i) => i._id === id);
          set(
            { cart: get().cart.filter((i) => i._id !== id) },
            false,
            "cart/removeItem"
          );
          if (item) toast(`${item.name} を消しました！`, { icon: "🗑️" });
        },

        updateQuantity: (id, quantity) => {
          const qty = Math.max(1, Math.trunc(Number(quantity) || 1));
          set(
            {
              cart: get().cart.map((i) =>
                i._id === id ? { ...i, quantity: qty } : i
              ),
            },
            false,
            "cart/updateQuantity"
          );
        },

        clearCart: () => {
          set({ cart: [] }, false, "cart/clear");
          toast("カートを空にしました", { icon: "🧹" });
        },

        totalItems: () =>
          get().cart.reduce((sum, item) => sum + item.quantity, 0),

        totalPrice: () =>
          get().cart.reduce((sum, item) => sum + item.quantity * (Number(item.price) || 0), 0),

        formattedTotalPrice: () => formatCurrency(get().totalPrice()),

        // when calling /api/checkout/session or /api/orders
        toApiItems: () =>
          get().cart.map((i) => ({ productId: i._id, quantity: i.quantity })),
      }),
      {
        name: "cart-storage", // localStorage key
        partialize: (state) => ({ cart: state.cart }), // only persist cart
      }
    )
  )
);

export default useCartStore;
