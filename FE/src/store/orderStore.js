import { create } from 'zustand';

const useOrderStore = create((set) => ({
  orderId: null,
  setOrderId: (id) => set({ orderId: id }),
  clearOrderId: () => set({ orderId: null }),
}));

export default useOrderStore;
