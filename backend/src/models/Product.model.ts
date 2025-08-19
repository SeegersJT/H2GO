import mongoose, { Schema, Document, Types, Model } from "mongoose";
import Branch from "./Branch.model";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";

export type ProductUnit = "unit" | "litre" | "kg" | "box";
export type CapacityUnit = "unit" | "L" | "kg";
export type ProductType = "GOOD" | "SERVICE" | "RETURNABLE_ASSET";

export interface IProduct extends Document {
  product_code: string; // e.g., "PROD-H2GO-0001"
  branch_id: Types.ObjectId; // -> Branch (catalog scope)
  sku: string; // unique per branch, uppercased/trimmed
  name: string;
  description?: string;

  product_type: ProductType; // "RETURNABLE_ASSET" for bottles/crates/etc
  unit: ProductUnit; // how it's sold
  capacity_value?: number; // e.g., 18.9 (for 18.9L bottle)
  capacity_unit?: CapacityUnit; // "L"/"kg"/"unit" (auto-derived if not set)

  track_serialized: boolean; // true when you track per-asset instances
  returnable: boolean; // deposit/return flows

  default_price?: number;
  currency_code?: string; // ISO-4217, e.g., "ZAR"

  billing_period?: "per_delivery" | "monthly"; // price frequency

  active: boolean;

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    product_code: { type: String, required: true, unique: true, trim: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },

    sku: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: false, trim: true },

    product_type: { type: String, required: true, enum: ["GOOD", "SERVICE", "RETURNABLE_ASSET"], default: "GOOD" },
    unit: { type: String, required: true, enum: ["unit", "litre", "kg", "box"], default: "unit" },
    capacity_value: { type: Number, required: false, min: 0 },
    capacity_unit: { type: String, required: false, enum: ["unit", "L", "kg"] },

    track_serialized: { type: Boolean, required: true, default: false },
    returnable: { type: Boolean, required: true, default: false },

    default_price: { type: Number, required: false, min: 0 },
    currency_code: { type: String, required: false, trim: true },

    billing_period: {
      type: String,
      enum: ["per_delivery", "monthly"],
      default: "per_delivery",
    },

    active: { type: Boolean, required: true, default: true, index: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
  },
  { timestamps: true }
);

// --- Normalizers ---
productSchema.path("sku").set((v: string) => v?.trim().toUpperCase());
productSchema.path("currency_code").set((v: string) => v?.toUpperCase());

// --- Guards + human code generation ---
productSchema.pre("validate", async function (next) {
  try {
    if (this.product_type === "RETURNABLE_ASSET") {
      this.track_serialized = true;
      this.returnable = true;
    }

    if (this.capacity_value != null && !this.capacity_unit) {
      this.capacity_unit = this.unit === "litre" ? "L" : this.unit === "kg" ? "kg" : "unit";
    }

    if (this.isNew && !this.product_code) {
      const branch = await Branch.findById(this.branch_id).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) return next(new Error("Invalid branch_id for product_code generation"));
      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("PROD", scope);
      this.product_code = formatHumanCode("PROD", scope, seq, 4);
    }

    next();
  } catch (err) {
    next(err as any);
  }
});

// --- Indexes ---
productSchema.index({ branch_id: 1, active: 1 });
productSchema.index({ branch_id: 1, sku: 1 }, { unique: true, name: "uniq_sku_per_branch" });
productSchema.index({ branch_id: 1, name: 1 }, { unique: false, collation: { locale: "en", strength: 2 }, name: "search_name_per_branch" });

// --- Output hygiene ---
productSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => ret,
});

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);
export default Product;
