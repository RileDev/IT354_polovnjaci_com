import { create } from "zustand";
import type { IAuthUser } from "../types";

type IAuthState = {
  user: IAuthUser | null;
  token: string | null;
  isLoading: boolean;
};

type IAuthActions = {
  setUser: (user: IAuthUser | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
};

type IAuthStore = IAuthState & IAuthActions;

export const useAuthStore = create<IAuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),

  logout: () => set({ user: null, token: null, isLoading: false }),
}));
