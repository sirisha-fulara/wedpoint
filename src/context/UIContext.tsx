import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Template } from './TemplateContext';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  qty: number;
  thumbnail: string;
  desc: string;
}

interface UIContextType {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  cartCount: number;
  cartTotal: number;
  addToCart: (template: Template) => void;
  removeFromCart: (id: string | number) => void;
  changeQty: (id: string | number, delta: number) => void;
  toggleCart: () => void;
  checkoutWA: () => void;

  // Notification
  notification: string | null;
  showNotification: (msg: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

const WA_NUMBER = "918830659769";

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Helpers to parse price string to number e.g., "₹499" -> 499
  const parsePrice = (priceStr: string | undefined): number => {
    if (!priceStr) return 0;
    const num = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 0 : num;
  };

  const addToCart = (template: Template) => {
    const priceNum = parsePrice(template.price);
    const thumbnail = template.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80';
    
    setCart(prev => {
      const existing = prev.find(item => item.id === template.id);
      if (existing) {
        return prev.map(item => item.id === template.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, {
        id: template.id,
        name: template.name,
        desc: template.description?.substring(0,40) || 'Set of 50 · Printed Card',
        price: priceNum,
        qty: 1,
        thumbnail
      }];
    });
    showNotification(`✦ "${template.name}" added to cart`);
  };

  const removeFromCart = (id: string | number) => setCart(prev => prev.filter(i => i.id !== id));
  
  const changeQty = (id: string | number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const toggleCart = () => setIsCartOpen(prev => !prev);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const checkoutWA = () => {
    const items = cart.map(c => `• ${c.name} x${c.qty} = ₹${(c.price * c.qty).toLocaleString('en-IN')}`).join('\n');
    const msg = `Hi WedMeet™! I want to order:\n\n${items}\n\nTotal: ₹${cartTotal.toLocaleString('en-IN')}\n\nPlease confirm my order 🙏`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2600);
  };

  return (
    <UIContext.Provider value={{
      cart, isCartOpen, cartCount, cartTotal, addToCart, removeFromCart, changeQty, toggleCart, checkoutWA,
      notification, showNotification
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
