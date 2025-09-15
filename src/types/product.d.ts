export type Product = {
  _id: string;
  name: string;
  imageSrc?: string;
  description?: string;
  category: "soap" | "oil";
  priceCents: number;     // canonical minor units
  price?: number;         // virtual from backend (major units)
  prices?: Record<string, number>; // optional per-currency minor units
  createdAt?: string;
};

export type User = {
  id: string | null;
  email: string | null;
  name?: string | null;
  role: "admin" | "customer";
};

export type CartItem = {
  productId: string;
  name: string;
  imageSrc?: string;
  quantity: number;
  // display-only price snapshot (major units) – backend recomputes real totals
  unitPrice?: number;
};
