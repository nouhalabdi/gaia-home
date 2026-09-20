import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const existing = get().items.find((i) => i._id === newItem._id);
        if (existing) {
          
          set({
            items: get().items.map((i) =>
              i._id === newItem._id 
                ? { ...i, quantity: i.quantity + newItem.quantity } 
                : i
            ),
          });
        } else {
          
          set({ 
            items: [...get().items, { 
              _id: newItem._id,
              name: newItem.name,
              price: newItem.price,
              image: newItem.image,
              quantity: newItem.quantity 
            }] 
          });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i._id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((i) => (i._id === id ? { ...i, quantity } : i)),
        }),
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    { name: 'gaia-cart' }
  )
);