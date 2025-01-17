import { create } from "zustand";

/* ─────────────────────────────────────────────────────────────
   1) Auth Store
   ───────────────────────────────────────────────────────────── */
interface User {
  email: string;
  // Add other user fields if needed
}

interface AuthState {
  user: User | null;
  setUser: (userData: User | null) => void;
}

// Separate store to handle authentication
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
}));

/* ─────────────────────────────────────────────────────────────
   2) Main Store (Guests, Inventory, Timers, etc.)
   ───────────────────────────────────────────────────────────── */

// Now we export the InventoryItem interface so other files can import
export interface InventoryItem {
  name: string;
  price: number;
  quantity: number; // Track quantity of each item
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

// Each guest’s timer data: time in seconds, plus whether it’s running
interface TimerData {
  time: number;
  isRunning: boolean;
}

interface TimerState {
  [guestNumber: number]: TimerData;
}

interface StoreState {
  // Guests State
  guests: Guest[];
  addGuest: (guest: Guest) => void;
  updateGuest: (guestNumber: number, updatedFields: Partial<Guest>) => void;
  removeGuest: (guestNumber: number) => void;
  clearGuests: () => void;

  // Room Timers
  roomTimers: TimerState;
  updateRoomTimer: (guestNumber: number, time: number, isRunning: boolean) => void;
  removeRoomTimer: (guestNumber: number) => void;

  // Billiardo Timers
  billiardoTimers: TimerState;
  updateBilliardoTimer: (guestNumber: number, time: number, isRunning: boolean) => void;
  removeBilliardoTimer: (guestNumber: number) => void;

  // Bar Items
  barItems: { [guestNumber: number]: string[] };
  addBarItem: (guestNumber: number, item: string) => void;
  removeBarItem: (guestNumber: number, item: string) => void;

  // Services Income State
  income: ServiceIncome;
  updateIncome: (income: Partial<ServiceIncome>) => void;

  // History State
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  removeFromHistory: (index: number) => void;
  clearHistory: () => void;

  // Inventory State
  inventory: InventoryItem[];
  addInventoryItem: (item: InventoryItem) => void;
  removeInventoryItem: (index: number) => void;
  updateInventoryQuantity: (name: string, delta: number) => void;
}

// Main store for everything else
export const useStore = create<StoreState>((set, get) => ({
  // ─────────────────────────────────────────────────────────
  // Guests State
  // ─────────────────────────────────────────────────────────
  guests: JSON.parse(localStorage.getItem("guests") || "[]"),
  addGuest: (guest) =>
    set((state) => {
      const updatedGuests = [...state.guests, guest];
      localStorage.setItem("guests", JSON.stringify(updatedGuests));
      return { guests: updatedGuests };
    }),
  updateGuest: (guestNumber, updatedFields) =>
    set((state) => {
      const updatedGuests = state.guests.map((guest) =>
        guest.guestNumber === guestNumber ? { ...guest, ...updatedFields } : guest
      );
      localStorage.setItem("guests", JSON.stringify(updatedGuests));
      return { guests: updatedGuests };
    }),
  removeGuest: (guestNumber) =>
    set((state) => {
      const updatedGuests = state.guests.filter((g) => g.guestNumber !== guestNumber);
      localStorage.setItem("guests", JSON.stringify(updatedGuests));
      return { guests: updatedGuests };
    }),
  clearGuests: () => {
    localStorage.removeItem("guests");
    set({ guests: [] });
  },

  // ─────────────────────────────────────────────────────────
  // Room Timers
  // ─────────────────────────────────────────────────────────
  roomTimers: JSON.parse(localStorage.getItem("roomTimers") || "{}"),
  updateRoomTimer: (guestNumber, time, isRunning) =>
    set((state) => {
      const updatedTimers = {
        ...state.roomTimers,
        [guestNumber]: { time, isRunning },
      };
      localStorage.setItem("roomTimers", JSON.stringify(updatedTimers));
      return { roomTimers: updatedTimers };
    }),
  removeRoomTimer: (guestNumber) =>
    set((state) => {
      const updatedTimers = { ...state.roomTimers };
      delete updatedTimers[guestNumber];
      localStorage.setItem("roomTimers", JSON.stringify(updatedTimers));
      return { roomTimers: updatedTimers };
    }),

  // ─────────────────────────────────────────────────────────
  // Billiardo Timers
  // ─────────────────────────────────────────────────────────
  billiardoTimers: JSON.parse(localStorage.getItem("billiardoTimers") || "{}"),
  updateBilliardoTimer: (guestNumber, time, isRunning) =>
    set((state) => {
      const updatedTimers = {
        ...state.billiardoTimers,
        [guestNumber]: { time, isRunning },
      };
      localStorage.setItem("billiardoTimers", JSON.stringify(updatedTimers));
      return { billiardoTimers: updatedTimers };
    }),
  removeBilliardoTimer: (guestNumber) =>
    set((state) => {
      const updatedTimers = { ...state.billiardoTimers };
      delete updatedTimers[guestNumber];
      localStorage.setItem("billiardoTimers", JSON.stringify(updatedTimers));
      return { billiardoTimers: updatedTimers };
    }),

  // ─────────────────────────────────────────────────────────
  // Bar Items
  // ─────────────────────────────────────────────────────────
  barItems: JSON.parse(localStorage.getItem("barItems") || "{}"),
  addBarItem: (guestNumber, item) => {
    const inventory = get().inventory;
    const inventoryItem = inventory.find((invItem) => invItem.name === item);

    if (inventoryItem && inventoryItem.quantity > 0) {
      set((state) => {
        const updatedBarItems = {
          ...state.barItems,
          [guestNumber]: [...(state.barItems[guestNumber] || []), item],
        };
        localStorage.setItem("barItems", JSON.stringify(updatedBarItems));
        return { barItems: updatedBarItems };
      });
      get().updateInventoryQuantity(item, -1); // Decrease quantity in inventory
    }
  },
  removeBarItem: (guestNumber, item) => {
    set((state) => {
      const updatedBarItems = {
        ...state.barItems,
        [guestNumber]: state.barItems[guestNumber].filter((i) => i !== item),
      };
      localStorage.setItem("barItems", JSON.stringify(updatedBarItems));
      return { barItems: updatedBarItems };
    });
    get().updateInventoryQuantity(item, 1); // Increase quantity in inventory
  },

  // ─────────────────────────────────────────────────────────
  // Services Income State
  // ─────────────────────────────────────────────────────────
  income: JSON.parse(
    localStorage.getItem("income") ||
      '{"psIncome": 0, "billiardoIncome": 0, "barIncome": 0}'
  ),
  updateIncome: (updates) =>
    set((state) => {
      const updatedIncome = {
        psIncome: state.income.psIncome + (updates.psIncome || 0),
        billiardoIncome:
          state.income.billiardoIncome + (updates.billiardoIncome || 0),
        barIncome: state.income.barIncome + (updates.barIncome || 0),
      };
      localStorage.setItem("income", JSON.stringify(updatedIncome));
      return { income: updatedIncome };
    }),

  // ─────────────────────────────────────────────────────────
  // History State
  // ─────────────────────────────────────────────────────────
  history: JSON.parse(localStorage.getItem("history") || "[]"),
  addToHistory: (item) => {
    const updatedHistory = [...get().history, item];
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    set({ history: updatedHistory });
  },
  removeFromHistory: (index) => {
    const updatedHistory = get().history.filter((_, i) => i !== index);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    set({ history: updatedHistory });
  },
  clearHistory: () => {
    localStorage.removeItem("history");
    set({ history: [] });
  },

  // ─────────────────────────────────────────────────────────
  // Inventory State
  // ─────────────────────────────────────────────────────────
  inventory: JSON.parse(localStorage.getItem("inventory") || "[]"),
  addInventoryItem: (item) =>
    set((state) => {
      const updatedInventory = [...state.inventory, item];
      localStorage.setItem("inventory", JSON.stringify(updatedInventory));
      return { inventory: updatedInventory };
    }),
  removeInventoryItem: (index) =>
    set((state) => {
      const updatedInventory = state.inventory.filter((_, i) => i !== index);
      localStorage.setItem("inventory", JSON.stringify(updatedInventory));
      return { inventory: updatedInventory };
    }),
  updateInventoryQuantity: (name, delta) =>
    set((state) => {
      const updatedInventory = state.inventory.map((invItem) =>
        invItem.name === name ? { ...invItem, quantity: invItem.quantity + delta } : invItem
      );
      localStorage.setItem("inventory", JSON.stringify(updatedInventory));
      return { inventory: updatedInventory };
    }),
}));
