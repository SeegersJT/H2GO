import mongoose, { Model, Schema } from "mongoose";
import { IProduct } from "../types/product";

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, index: true },
    sku: { type: String, required: true, unique: true },
    type: { type: String, enum: ["ASSET", "CONSUMABLE"], required: true },
    unit: { type: String, enum: ["EA", "L", "ML", "KG"] },
    metadata: { type: Schema.Types.Mixed },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
