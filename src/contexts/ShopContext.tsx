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
  cartCount: number;
  cartSubtotal: number;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const cartKey = (uid: string) => `od_bsb_cart_${uid}`;
const favKey = (uid: string) => `od_bsb_fav_${uid}`;

const parsePrice = (p: string): number => {
  const m = p.replace(/[^0-9.]/g, "");
  return parseFloat(m) || 0;
};

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favourites, setFavourites] = useState<ShopItem[]>([]);

  // Load per-user data
  useEffect(() => {
    if (!user) {
      setCart([]);
      setFavourites([]);
      return;
    }
    try {
      const c = localStorage.getItem(cartKey(user.id));
      const f = localStorage.getItem(favKey(user.id));
      setCart(c ? JSON.parse(c) : []);
      setFavourites(f ? JSON.parse(f) : []);
    } catch { /* ignore */ }
  }, [user]);

  // Persist
  useEffect(() => {
    if (user) localStorage.setItem(cartKey(user.id), JSON.stringify(cart));
  }, [cart, user]);
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
    if (!requireAuth("Create an account to add items to your cart.")) return false;
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

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartSubtotal = cart.reduce((s, c) => s + parsePrice(c.price) * c.qty, 0);

  return (
    <ShopContext.Provider
      value={{ cart, favourites, addToCart, removeFromCart, updateQty, clearCart, toggleFavourite, isFavourite, cartCount, cartSubtotal }}
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
