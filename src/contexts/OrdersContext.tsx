// src/contexts/OrdersContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// === TYPES (exported separately) ===
export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  date: string;                    // ISO string
  createdAt: number;               // timestamp for sorting
  customer: {
    name: string;
    email: string;
    address: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;                 // Naira (e.g. 15999.99)
    quantity: number;
    image: string;
  }>;
  total: number;                   // Naira
  status: OrderStatus;
  deliveryDate?: string;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "date" | "createdAt">) => void;
  updateOrderStatus: (id: string, status: OrderStatus, deliveryDate?: string) => void;
}

// === CONTEXT ===
const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("admin-orders");
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("admin-orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, "id" | "date" | "createdAt">) => {
    const now = Date.now();
    const isoNow = new Date().toISOString();
    const newOrder: Order = {
      ...orderData,
      id: now.toString(),
      date: isoNow,
      createdAt: now,
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrderStatus = (id: string, status: OrderStatus, deliveryDate?: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status, deliveryDate } : order
      )
    );
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used within OrdersProvider");
  return context;
};

// DO NOT re-export types here — causes conflict
// They are already exported above