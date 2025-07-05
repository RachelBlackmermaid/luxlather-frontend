import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { formatYen } from "../assets/utils/currency";

// types
export type CartItem = {
  _id: string;
  name: string;
  price: number;
  imageSrc: string;
  quantity: number;
};

// cart state
type CartState = {
  cart: CartItem[];

  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  //computed
  totalItems: () => number;
  totalPrice: () => number;
  formattedTotalPrice: () => string;
};

const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],

        // add product or update quantity
        addToCart: (item, quantity ) => {
          const  cart = get().cart;
          const existing = cart.find((i) => i._id === item._id);

          if (existing) {
            set(
              {
                cart: cart.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + quantity} : i),
              },
              false,
              "cart/addQuantity"
            );
            toast.success(`Updated Quantity x ${quantity}`);
          } else {
            set (
              { cart: [...cart, { ...item, quantity }]},
              false,
              "cart/addItem"
            );
            toast.success(`${item.name} added to cart`);
          }
        },
        //Remove item from cart
        removeFromCart: (id) => {
          const item = get().cart.find((i) => i._id === id);
          set(
            { cart: get().cart.filter((i) => i._id !== id) },
            false,
            "cart/removeItem"
          );
          if (item) toast(`${item.name} を消しました！`, { icon: "🗑️"});
        },

        //Update quantity directly
        updateQuantity: (id, quantity) => {
          set(
            {
              cart: get().cart.map((i) => i._id === id ? { ...i, quantity } : i),
            },
            false,
            "cart/updateQuantity"
          );
        },

        //Clear entire cart
        clearCart: () => {
          set({ cart: []}, false, "cart/clear");
          toast("カートを空にしました", { icon: "🧹"});
        },
        //Total item computed 
        totalItems: () => 
         get().cart.reduce((sum, item) => sum + item.quantity, 0),
        //Total price
        totalPrice: () => 
          get().cart.reduce((sum, item) => sum + item.quantity * item.price, 0),

        //total price formatted
        formattedTotalPrice: () => formatYen(get().totalPrice()),
      }),
      {
        name:"cart-storage", //localstorage key
        partialize: (state) => ({cart: state.cart}), //only persists cart  array
      }
    )
  )

);

export default useCartStore;