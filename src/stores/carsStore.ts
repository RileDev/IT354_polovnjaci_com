import { create } from "zustand";
import type { ICar } from "../types";

type CarsState = {
  cars: ICar[];
  loading: boolean;
  setCars: (cars: ICar[]) => void;
  setLoading: (loading: boolean) => void;
};

export const useCarsStore = create<CarsState>((set) => ({
  cars: [],
  loading: false,
  setCars: (cars) => set({ cars }),
  setLoading: (loading) => set({ loading }),
}));
