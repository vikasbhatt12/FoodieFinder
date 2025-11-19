import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  veg: boolean;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  restaurantImage: string | null;
  addToCart: (item: any, restId: string, restName: string, restImage: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  isCartOpen: boolean;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [restaurantImage, setRestaurantImage] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed.items || []);
        setRestaurantId(parsed.restaurantId);
        setRestaurantName(parsed.restaurantName);
        setRestaurantImage(parsed.restaurantImage);
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({ items, restaurantId, restaurantName, restaurantImage }));
  }, [items, restaurantId, restaurantName, restaurantImage]);

  const addToCart = (item: any, restId: string, restName: string, restImage: string) => {
    // If adding from a new restaurant, auto-clear old cart to avoid conflicts (Simplified logic)
    if (restaurantId && restaurantId !== restId) {
       if(!window.confirm(`Start new basket? Items from ${restaurantName} will be removed.`)) return;
       setItems([]);
    }

    setRestaurantId(restId);
    setRestaurantName(restName);
    setRestaurantImage(restImage);

    setItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    
    toast.success(`Added ${item.name}`);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) => i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter((i) => i._id !== itemId);
    });
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    setRestaurantImage(null);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, restaurantId, restaurantName, restaurantImage, 
      addToCart, removeFromCart, clearCart, toggleCart, isCartOpen, 
      cartTotal, cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};