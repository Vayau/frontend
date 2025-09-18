import { create } from "zustand";

interface UserState {
  userId: string | null;
  setUserId: (id: string) => void;
  clearUserId: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: typeof window !== "undefined" ? localStorage.getItem("userId") : null,
  setUserId: (id: string) => {
    localStorage.setItem("userId", id);
    set({ userId: id });
  },
  clearUserId: () => {
    localStorage.removeItem("userId");
    set({ userId: null });
  },
}));
