"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuthContext } from "./auth-provider";
import prisma from "@/lib/prisma";
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
      const items = await prisma.cart.findMany({
        where: { user_id: user.id },
        include: {
          game: {
            select: {
              id: true,
              title: true,
              price: true,
              discount_price: true,
              image_url: true,
              developer: true,
            },
          },
        },
      });
      setCartItems(
        items.map((item) => ({
          ...item,
          game: {
            ...item.game,
            price: Number(item.game.price),
            discount_price: item.game.discount_price
              ? Number(item.game.discount_price)
              : undefined,
          },
        }))
      );
    } catch (error) {
      console.error("Failed to fetch cart", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!userLoading) {
      fetchCart();
    }
  }, [userLoading, fetchCart]);

  const addToCart = async (gameId: string) => {
    if (!user) {
      toast.error("Please log in to add items to cart");
      return;
    }
    try {
      const existingItem = cartItems.find((item) => item.game_id === gameId);
      if (existingItem) {
        toast.info("Item already in cart");
        return;
      }
      await prisma.cart.create({
        data: {
          user_id: user.id,
          game_id: gameId,
          quantity: 1,
        },
      });
      toast.success("Item added to cart");
      fetchCart();
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast.error("Failed to add item to cart");
    }
  };

  const removeFromCart = async (cartId: string) => {
    try {
      await prisma.cart.delete({
        where: { id: cartId },
      });
      toast.success("Item removed from cart");
      fetchCart();
    } catch (error) {
      console.error("Failed to remove from cart", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const purchaseAll = async () => {
    if (!user || cartItems.length === 0) return;

    try {
      const purchases = cartItems.map((item) => ({
        user_id: user.id,
        game_id: item.game_id,
        price: item.game.price, // Original price
        amount_paid: item.game.discount_price ?? item.game.price, // Actual amount paid
      }));

      await prisma.purchase.createMany({
        data: purchases,
      });

      await prisma.cart.deleteMany({
        where: { user_id: user.id },
      });

      toast.success("Purchase completed successfully!");
      setCartItems([]); // Limpa o carrinho
    } catch (error) {
      console.error("Failed to complete purchase", error);
      toast.error("Failed to complete purchase");
    }
  };

  const total = cartItems.reduce((sum, item) => {
    const price = item.game.discount_price ?? item.game.price;
    return sum + price;
  }, 0);

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
