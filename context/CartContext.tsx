"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { toast } from "react-toastify";

import { Game } from "@/app/Type";

// Item no carrinho
export interface CartItem extends Game {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (game: Game | undefined) => void;
  removeFromCart: (gameId: string) => void;
  updateQuantity: (gameId: string, quantity: number) => void;
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook customizado
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false); // evita render até carregar localStorage

  // 1. Carregar carrinho ao montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("hyperium_cart");
      if (storedCart) {
        try {
          const parsed = JSON.parse(storedCart);
          setCartItems(parsed);
        } catch (e) {
          console.error("Erro ao carregar carrinho do localStorage", e);
        }
      }
      setIsReady(true); // agora pode renderizar
    }
  }, []);

  // 2. Atualizar localStorage quando carrinho mudar
  useEffect(() => {
    if (isReady) {
      localStorage.setItem("hyperium_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isReady]);

  // 3. Adicionar ao carrinho
  const addToCart = (game: Game | undefined) => {
    if(!game) return null;
    const exists = cartItems.find((item) => item.id === game.id);
    if (exists) {
      toast.info(`'${game.title}' já está no seu carrinho!`);
      return;
    }
    toast.success(`'${game.title}' foi adicionado ao carrinho!`);
    setCartItems([...cartItems, { ...game, quantity: 1 }]);
  };

  // 4. Remover do carrinho
  const removeFromCart = (gameId: string) => {
    const item = cartItems.find((item) => item.id === gameId);
    if (item) {
      toast.error(`'${item.title}' foi removido do carrinho.`);
    }
    setCartItems(cartItems.filter((item) => item.id !== gameId));
  };

  // 5. Atualizar quantidade
  const updateQuantity = (gameId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(gameId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === gameId ? { ...item, quantity } : item
        )
      );
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 🚫 NÃO RENDERIZE NADA até o carrinho estar pronto
  if (!isReady) return null;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
