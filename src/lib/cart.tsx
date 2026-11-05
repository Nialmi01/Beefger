'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, SelectedModifier } from './types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number, modifiers?: SelectedModifier[], notes?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('beffger_cart');
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('beffger_cart', JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const addItem = (
    product: Product,
    quantity: number,
    modifiers: SelectedModifier[] = [],
    notes: string = ''
  ) => {
    const modTotal = modifiers.reduce((acc, m) => acc + m.price_adjustment, 0);
    const unitPrice = product.price + modTotal;
    const totalPrice = unitPrice * quantity;

    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      product,
      quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      modifiers,
      notes,
    };

    setItems((prev) => [...prev, newItem]);
    setIsOpen(true);
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity,
            total_price: item.unit_price * quantity,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
