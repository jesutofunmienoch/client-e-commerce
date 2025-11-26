// src/lib/products-store.ts
import { create } from "zustand";
import { persist, StateStorage, PersistOptions } from "zustand/middleware";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  featured?: boolean;
};

type ProductsStore = {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
};

// Default products (only used on first visit)
const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    description: "Premium noise-cancelling headphones with 30hr battery",
    price: 85000,
    salePrice: 69999,
    image: "https://images.unsplash.com/photo-1505740420928-3e67941ac159?w=800",
    images: ["https://images.unsplash.com/photo-1505740420928-3e67941ac159?w=800"],
    category: "Electronics",
    stock: 12,
    rating: 4.8,
    reviews: 342,
    featured: true,
  },
  {
    id: "2",
    name: "Smart Watch Ultra",
    description: "Advanced fitness tracking with heart rate monitor",
    price: 125000,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800",
    images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800"],
    category: "Electronics",
    stock: 8,
    rating: 4.9,
    reviews: 567,
    featured: true,
  },
];

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set) => ({
      products: [],

      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: Date.now().toString(),
          images: product.images.length > 0 ? product.images : [product.image],
          featured: product.featured ?? false,
        };
        set((state) => ({ products: [...state.products, newProduct] }));
        return newProduct;
      },

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
    }),
    {
      name: "emperor-products-store",

      // Properly typed merge function — NO 'any'!
      merge: (persistedState, currentState): ProductsStore => {
        const persisted = persistedState as ProductsStore | undefined;

        if (persisted?.products && persisted.products.length > 0) {
          return persisted;
        }

        return { ...currentState, products: defaultProducts };
      },
    } as PersistOptions<ProductsStore>
  )
);

// Optional helper (safe to keep)
export const getProducts = () => useProductsStore.getState().products;