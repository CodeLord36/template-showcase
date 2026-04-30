import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

export type ShopItem = {
  id: string | number;
  title: string;
  price: string;
  image?: string;
  type?: "digital" | "service";
};

export type CartItem = ShopItem & { qty: number };

type ShopContextType = {
  cart: CartItem[];
  favourites: ShopItem[];
  addToCart: (item: ShopItem) => boolean;
  removeFromCart: (id: ShopItem["id"]) => void;
  updateQty: (id: ShopItem["id"], qty: number) => void;
  clearCart: () => void;
  toggleFavourite: (item: ShopItem) => boolean;
  isFavourite: (id: ShopItem["id"]) => boolean;
  checkout: () => boolean;
  cartCount: number;
  cartSubtotal: number;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const GUEST_CART_KEY = "od_bsb_cart_guest";
const cartKey = (uid: string) => `od_bsb_cart_${uid}`;
const favKey = (uid: string) => `od_bsb_fav_${uid}`;

const parsePrice = (p: string): number => {
  const m = p.replace(/[^0-9.]/g, "");
  return parseFloat(m) || 0;
};

const readCart = (key: string): CartItem[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const mergeCarts = (a: CartItem[], b: CartItem[]): CartItem[] => {
  const map = new Map<string | number, CartItem>();
  [...a, ...b].forEach((item) => {
    const existing = map.get(item.id);
    if (existing) map.set(item.id, { ...existing, qty: existing.qty + item.qty });
    else map.set(item.id, { ...item });
  });
  return Array.from(map.values());
};

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => readCart(GUEST_CART_KEY));
  const [favourites, setFavourites] = useState<ShopItem[]>([]);

  // On login: merge guest cart into user cart, clear guest cart. On logout: switch to guest cart.
  useEffect(() => {
    if (user) {
      const userCart = readCart(cartKey(user.id));
      const guestCart = readCart(GUEST_CART_KEY);
      const merged = mergeCarts(userCart, guestCart);
      setCart(merged);
      if (guestCart.length) localStorage.removeItem(GUEST_CART_KEY);
      try {
        const f = localStorage.getItem(favKey(user.id));
        setFavourites(f ? JSON.parse(f) : []);
      } catch { setFavourites([]); }
    } else {
      setCart(readCart(GUEST_CART_KEY));
      setFavourites([]);
    }
  }, [user]);

  // Persist cart to the right bucket
  useEffect(() => {
    const key = user ? cartKey(user.id) : GUEST_CART_KEY;
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, user]);

  // Persist favourites (user-only)
  useEffect(() => {
    if (user) localStorage.setItem(favKey(user.id), JSON.stringify(favourites));
  }, [favourites, user]);

  const requireAuth = useCallback((reason: string) => {
    if (!isAuthenticated) {
      openAuthModal("signup", reason);
      return false;
    }
    return true;
  }, [isAuthenticated, openAuthModal]);

  const addToCart = (item: ShopItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    toast({ title: "Added to cart", description: item.title });
    return true;
  };

  const removeFromCart = (id: ShopItem["id"]) =>
    setCart((prev) => prev.filter((c) => c.id !== id));

  const updateQty = (id: ShopItem["id"], qty: number) =>
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: Math.max(1, qty) } : c));

  const clearCart = () => setCart([]);

  const isFavourite = (id: ShopItem["id"]) => favourites.some((f) => f.id === id);

  const toggleFavourite = (item: ShopItem) => {
    if (!requireAuth("Create an account to save favourites.")) return false;
    setFavourites((prev) => {
      if (prev.some((f) => f.id === item.id)) {
        toast({ title: "Removed from favourites" });
        return prev.filter((f) => f.id !== item.id);
      }
      toast({ title: "Added to favourites", description: item.title });
      return [...prev, item];
    });
    return true;
  };

  const checkout = () => {
    if (cart.length === 0) {
      toast({ title: "Your cart is empty" });
      return false;
    }
    if (!requireAuth("Create an account to complete your purchase.")) return false;
    toast({ title: "Proceeding to checkout", description: "Payment integration coming soon." });
    return true;
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartSubtotal = cart.reduce((s, c) => s + parsePrice(c.price) * c.qty, 0);

  return (
    <ShopContext.Provider
      value={{ cart, favourites, addToCart, removeFromCart, updateQty, clearCart, toggleFavourite, isFavourite, checkout, cartCount, cartSubtotal }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
};
