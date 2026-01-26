import { create } from "zustand";
import type { IBodyType, IBrand, IFuel, IModel } from "../types";

type FiltersState = {
  brands: IBrand[];
  models: IModel[];
  fuels: IFuel[];
  bodyTypes: IBodyType[];
  years: number[];
  selectedBrand: string;
  selectedModel: string;
  selectedFuel: string;
  selectedBodyType: string;
  yearFrom: string;
  setBrands: (brands: IBrand[]) => void;
  setModels: (models: IModel[]) => void;
  setFuels: (fuels: IFuel[]) => void;
  setBodyTypes: (bodyTypes: IBodyType[]) => void;
  setYears: (years: number[]) => void;
  setSelectedBrand: (brandId: string) => void;
  setSelectedModel: (modelId: string) => void;
  setSelectedFuel: (fuelId: string) => void;
  setSelectedBodyType: (bodyTypeId: string) => void;
  setYearFrom: (year: string) => void;
  getFilters: () => {
    brand?: string;
    model?: string;
    fuel?: string;
    bodyType?: string;
    yearFrom?: number;
  };
  clearFilters: () => void;
};

const DEFAULT_YEARS = Array.from({ length: 70 }, (_, i) => new Date().getFullYear() - i);

export const useFiltersStore = create<FiltersState>((set, get) => ({
  brands: [],
  models: [],
  fuels: [],
  bodyTypes: [],
  years: DEFAULT_YEARS,
  selectedBrand: "",
  selectedModel: "",
  selectedFuel: "",
  selectedBodyType: "",
  yearFrom: "",
  setBrands: (brands) => set({ brands }),
  setModels: (models) => set({ models }),
  setFuels: (fuels) => set({ fuels }),
  setBodyTypes: (bodyTypes) => set({ bodyTypes }),
  setYears: (years) => set({ years }),
  setSelectedBrand: (selectedBrand) => set({ selectedBrand }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  setSelectedFuel: (selectedFuel) => set({ selectedFuel }),
  setSelectedBodyType: (selectedBodyType) => set({ selectedBodyType }),
  setYearFrom: (yearFrom) => set({ yearFrom }),
  getFilters: () => {
    const {
      selectedBrand,
      selectedModel,
      selectedFuel,
      selectedBodyType,
      yearFrom,
    } = get();

    return {
      ...(selectedBrand && { brand: selectedBrand }),
      ...(selectedModel && { model: selectedModel }),
      ...(selectedFuel && { fuel: selectedFuel }),
      ...(selectedBodyType && { bodyType: selectedBodyType }),
      ...(yearFrom && { yearFrom: Number(yearFrom) }),
    };
  },
  clearFilters: () =>
    set({
      selectedBrand: "",
      selectedModel: "",
      selectedFuel: "",
      selectedBodyType: "",
      yearFrom: "",
    }),
}));
