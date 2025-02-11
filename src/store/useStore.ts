import { create } from "zustand";

/* ─────────────────────────────────────────────────────────────
   1) Auth Store
   ───────────────────────────────────────────────────────────── */
interface User {
  email: string;
}

interface AuthState {
  user: User | null;
  setUser: (userData: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
}));

/* ─────────────────────────────────────────────────────────────
   2) Main Store (Guests, Inventory, Timers, etc.)
   ───────────────────────────────────────────────────────────── */

export interface InventoryItem {
  name: string;
  price: number;
  quantity: number;
  originalStock: number; // Ensures proper stock tracking
}

interface Guest {
  guestNumber: number;
  room: string;
  billiardoTime: string;
  billiardoCost: number;
  barItems: string[];
  total: number;
}

interface ServiceIncome {
  psIncome: number;
  billiardoIncome: number;
  barIncome: number;
}

interface HistoryItem {
  guestNumber: number;
  room: string;
  roomCost: number;
  billiardo: string;
  billiardoCost: number;
  barItems: string;
  total: number;
}

interface TimerData {
  time: number;
  isRunning: boolean;
}

interface TimerState {
  [guestNumber: number]: TimerData;
}

interface StoreState {
  guests: Guest[];
  addGuest: (guest: Guest) => void;
  updateGuest: (guestNumber: number, updatedFields: Partial<Guest>) => void;
  removeGuest: (guestNumber: number) => void;
  clearGuests: () => void;

  roomTimers: TimerState;
  updateRoomTimer: (
    guestNumber: number,
    time: number,
    isRunning: boolean
  ) => void;
  removeRoomTimer: (guestNumber: number) => void;

  billiardoTimers: TimerState;
  updateBilliardoTimer: (
    guestNumber: number,
    time: number,
    isRunning: boolean
  ) => void;
  removeBilliardoTimer: (guestNumber: number) => void;

  barItems: { [guestNumber: number]: string[] };
  addBarItem: (guestNumber: number, item: string) => void;
  removeBarItem: (guestNumber: number, item: string) => void;

  income: ServiceIncome;
  updateIncome: (income: Partial<ServiceIncome>) => void;

  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  removeFromHistory: (index: number) => void;
  clearHistory: () => void;

  inventory: InventoryItem[];
  addInventoryItem: (item: InventoryItem) => void;
  removeInventoryItem: (index: number) => void;
  updateInventoryQuantity: (name: string, delta: number) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  /* Guests */
  guests: [],
  addGuest: (guest) => set((state) => ({ guests: [...state.guests, guest] })),

  updateGuest: (guestNumber, updatedFields) =>
    set((state) => ({
      guests: state.guests.map((guest) =>
        guest.guestNumber === guestNumber ? { ...guest, ...updatedFields } : guest
      ),
    })),

  removeGuest: (guestNumber) =>
    set((state) => {
      const updatedGuests = state.guests.filter(
        (g) => g.guestNumber !== guestNumber
      );
      return { guests: updatedGuests };
    }),

  clearGuests: () => set({ guests: [] }),

  /* Timers */
  roomTimers: {},
  updateRoomTimer: (guestNumber, time, isRunning) =>
    set((state) => ({
      roomTimers: { ...state.roomTimers, [guestNumber]: { time, isRunning } },
    })),

  removeRoomTimer: (guestNumber) =>
    set((state) => {
      const updatedTimers = { ...state.roomTimers };
      delete updatedTimers[guestNumber];
      return { roomTimers: updatedTimers };
    }),

  billiardoTimers: {},
  updateBilliardoTimer: (guestNumber, time, isRunning) =>
    set((state) => ({
      billiardoTimers: {
        ...state.billiardoTimers,
        [guestNumber]: { time, isRunning },
      },
    })),

  removeBilliardoTimer: (guestNumber) =>
    set((state) => {
      const updatedTimers = { ...state.billiardoTimers };
      delete updatedTimers[guestNumber];
      return { billiardoTimers: updatedTimers };
    }),

  /* Bar Items */
  barItems: {},
  addBarItem: (guestNumber, item) => {
    const inventory = get().inventory;
    const inventoryItem = inventory.find((invItem) => invItem.name === item);

    if (inventoryItem && inventoryItem.quantity > 0) {
      set((state) => ({
        barItems: {
          ...state.barItems,
          [guestNumber]: [...(state.barItems[guestNumber] || []), item],
        },
      }));
      get().updateInventoryQuantity(item, -1);
    }
  },

  removeBarItem: (guestNumber, item) => {
    set((state) => {
      const updatedBarItems = {
        ...state.barItems,
        [guestNumber]: state.barItems[guestNumber].filter((i) => i !== item),
      };

      const invItem = get().inventory.find((inv) => inv.name === item);
      if (invItem && invItem.quantity < invItem.originalStock) {
        get().updateInventoryQuantity(item, 1);
      }

      return { barItems: updatedBarItems };
    });
  },

  /* Income */
  income: { psIncome: 0, billiardoIncome: 0, barIncome: 0 },
  updateIncome: (updates) =>
    set((state) => ({
      income: {
        psIncome: state.income.psIncome + (updates.psIncome || 0),
        billiardoIncome:
          state.income.billiardoIncome + (updates.billiardoIncome || 0),
        barIncome: state.income.barIncome + (updates.barIncome || 0),
      },
    })),

  /* History */
  history: [],
  addToHistory: (item) =>
    set((state) => ({ history: [...state.history, item] })),

  removeFromHistory: (index) =>
    set((state) => ({
      history: state.history.filter((_, i) => i !== index),
    })),

  clearHistory: () => set({ history: [] }),

  /* Inventory */
  inventory: [],
  addInventoryItem: (item) =>
    set((state) => ({
      inventory: [
        ...state.inventory,
        { ...item, originalStock: item.quantity },
      ],
    })),

  removeInventoryItem: (index) =>
    set((state) => ({
      inventory: state.inventory.filter((_, i) => i !== index),
    })),

  updateInventoryQuantity: (name, delta) =>
    set((state) => ({
      inventory: state.inventory.map((invItem) =>
        invItem.name === name
          ? { ...invItem, quantity: Math.max(invItem.quantity + delta, 0) }
          : invItem
      ),
    })),
}));

// ─────────────────────────────────────────────────────────
// ✅ Efficiently handle localStorage updates with Zustand’s subscribe API
// ─────────────────────────────────────────────────────────
useStore.subscribe((state) => {
  localStorage.setItem("inventory", JSON.stringify(state.inventory));
  localStorage.setItem("history", JSON.stringify(state.history));
  localStorage.setItem("income", JSON.stringify(state.income));
});
