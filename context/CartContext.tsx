import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { Product } from "@/services/api";

export type CartItem = {
  product: Product;
  quantity: number;
  selected: boolean; // 🔥 NEW
};

type CartContextValue = {
  items: CartItem[];

  totalItems: number;
  totalPrice: number;

  addToCart: (product: Product, qty?: number) => void;

  getItemQty: (productId: number) => number;
  increaseQty: (productId: number) => void;
  decreaseQty: (productId: number) => void;

  toggleSelect: (productId: number) => void; // 🔥 NEW

  removeFromCart: (productId: number) => void;
  isInCart: (productId: number) => boolean;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // 🔥 ADD TO CART (UPDATED)
  const addToCart = useCallback((product: Product, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);

      if (existing) {
        const newQty = existing.quantity + qty;

        if (newQty <= 0) {
          return prev.filter((item) => item.product.id !== product.id);
        }

        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQty }
            : item
        );
      }

      if (qty < 0) return prev;

      return [
        ...prev,
        {
          product,
          quantity: qty,
          selected: true, // 🔥 default langsung kepilih
        },
      ];
    });
  }, []);

  // 🔥 TOGGLE CHECKBOX
  const toggleSelect = useCallback((productId: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  }, []);

  // ✅ GET QTY
  const getItemQty = useCallback(
    (productId: number) => {
      const item = items.find((i) => i.product.id === productId);
      return item ? item.quantity : 0;
    },
    [items]
  );

  // ✅ INCREASE
  const increaseQty = useCallback(
    (productId: number) => {
      const item = items.find((i) => i.product.id === productId);
      if (item) {
        addToCart(item.product, 1);
      }
    },
    [items, addToCart]
  );

  // ✅ DECREASE
  const decreaseQty = useCallback(
    (productId: number) => {
      const item = items.find((i) => i.product.id === productId);
      if (item) {
        addToCart(item.product, -1);
      }
    },
    [items, addToCart]
  );

  const removeFromCart = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const isInCart = useCallback(
    (productId: number) => items.some((item) => item.product.id === productId),
    [items]
  );

  const clearCart = useCallback(() => setItems([]), []);

  // 🔥 ONLY SELECTED ITEMS
  const selectedItems = useMemo(
    () => items.filter((item) => item.selected),
    [items]
  );

  const totalItems = useMemo(
    () =>
      selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectedItems]
  );

  const totalPrice = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [selectedItems]
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalPrice,
      addToCart,

      getItemQty,
      increaseQty,
      decreaseQty,

      toggleSelect, // 🔥 NEW

      removeFromCart,
      isInCart,
      clearCart,
    }),
    [
      items,
      totalItems,
      totalPrice,
      addToCart,
      getItemQty,
      increaseQty,
      decreaseQty,
      toggleSelect,
      removeFromCart,
      isInCart,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart harus dipakai di dalam CartProvider");
  }
  return ctx;
}