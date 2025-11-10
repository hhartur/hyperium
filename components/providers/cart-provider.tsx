"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuthContext } from "./auth-provider";
import { toast } from "sonner";

interface CartItem {
  id: string;
  game_id: string;
  user_id: string;
  quantity: number;
  game: {
    id: string;
    title: string;
    price: number;
    discount_price?: number | null;
    image_url: string;
    developer: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (gameId: string) => Promise<void>;
  removeFromCart: (cartId: string) => Promise<void>;
  purchaseAll: () => Promise<void>;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useAuthContext();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        headers: { "x-user-id": user.id },
      });
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = async (gameId: string): Promise<void> => {
    if (!user) {
      toast.error("Please log in");
      return;
    }

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, game_id: gameId }),
      });
      toast.success("Item added");
      fetchCart();
    } catch (err) {
      console.error("Failed to add to cart", err);
      toast.error("Failed to add item");
    }
  };

  const removeFromCart = async (cartId: string) => {
    if (!user) return;
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_id: cartId, userId: user.id }),
      });
      fetchCart();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  useEffect(() => {
    if (!userLoading) {
      fetchCart();
    }
  }, [userLoading, fetchCart]);

  const purchaseAll = async () => {
    if (!user || cartItems.length === 0) return;

    try {
      const purchases = cartItems.map((item) => ({
        user_id: user.id,
        game_id: item.game_id,
        price: item.game.price, // Original price
        amount_paid: item.game.discount_price ?? item.game.price, // Actual amount paid
      }));

      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchases }),
      });

      if (res.ok) {
        toast.success("Purchase completed successfully!");
        setCartItems([]); // Limpa o carrinho
      } else {
        toast.error("Failed to complete purchase");
      }
    } catch (error) {
      console.error("Failed to complete purchase", error);
      toast.error("Failed to complete purchase");
    }
  };

  const cartArray = Array.isArray(cartItems) ? cartItems : [];
  const total = cartArray.reduce((acc, item) => acc + (item.game.discount_price ?? item.game.price), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        purchaseAll,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
