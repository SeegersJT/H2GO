import { ObjectId } from "./core";

export type ProductType = "ASSET" | "CONSUMABLE";
export type Unit = "EA" | "L" | "ML" | "KG";

export interface IProduct {
  _id: ObjectId;
  name: string;
  sku: string;
  type: ProductType;
  unit?: Unit;
  metadata?: Record<string, any>;
  isActive: boolean;
}
