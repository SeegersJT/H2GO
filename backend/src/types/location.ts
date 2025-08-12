import { ObjectId } from "./core";

export interface ICountry {
  _id: ObjectId;
  name: string;
  iso2: string;
  iso3: string;
  phoneCode?: string;
  currency?: string;
}

export interface IAddress {
  _id: ObjectId;
  user?: ObjectId;
  label?: string;
  line1: string;
  line2?: string;
  suburb?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country: ObjectId;
  geo?: { lat: number; lng: number };
  isDefault?: boolean;
}

export interface IBranch {
  _id: ObjectId;
  name: string;
  code: string;
  country: ObjectId;
  address?: ObjectId;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface IVehicle {
  _id: ObjectId;
  branch: ObjectId;
  regNumber: string;
  capacityUnits?: number;
  isActive: boolean;
  metadata?: Record<string, any>;
}
