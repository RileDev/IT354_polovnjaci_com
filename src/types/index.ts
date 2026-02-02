// TypeScript interfaces for the Polovnjaci.rs frontend

export interface IUser {
  uid: string;
  name?: string;
  username?: string;
  email?: string;
  phoneNum?: string;
  city?: string;
  avatar?: string;
  role?: "user" | "admin";
  createdAt?: string;
}

export interface ICarFeatures {
  isCredit: boolean;
  isLeasing: boolean;
  hasWarranty: boolean;
}

export interface ICar {
  _id: string;
  sellerId: string;
  title: string;
  brandId: string;
  modelId: string;
  price: number;
  currency: "EUR" | "RSD";
  year: number;
  fuel: string;
  engineDisplacement: number;
  engineType: number;
  bodyType: string;
  mileage: number;
  description: string;
  noOwners: number;
  images: string[];
  features: ICarFeatures;
  createdAt: string;
}

export interface IBrand {
  _id: string;
  name: string;
}

export interface IModel {
  _id: string;
  brandId: string;
  name: string;
}

export interface IFuel {
  _id: string;
  name: string;
}

export interface IBodyType {
  _id: string;
  name: string;
}

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
}

export interface ICarSearchFilters {
  brandId?: string;
  modelId?: string;
  yearFrom?: number;
  fuel?: string;
  bodyType?: string;
}
