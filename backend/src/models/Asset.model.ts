import mongoose, { Schema, Document, Types, Model } from "mongoose";
import Product from "./Product.model";
import Branch from "./Branch.model";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";

export type HolderType = "BRANCH" | "VEHICLE" | "CUSTOMER" | "USER" | "SUPPLIER" | "OTHER";
export type AssetStatus = "ACTIVE" | "LOST" | "DAMAGED" | "RETIRED";
export type AssetState = "FULL" | "EMPTY" | "CLEANING" | "UNKNOWN";

export interface IAsset extends Document {
  asset_no: string; // e.g., "ASSET-H2GO-0001"
  product_id: Types.ObjectId; // -> Product (should be RETURNABLE_ASSET)
  serial_no?: string; // etched/printed identifier (optional but can be unique per product)
  status: AssetStatus; // lifecycle state

  asset_state: AssetState; // last known content state (optional helper)
  current_holder_type: HolderType; // where the asset currently is
  current_holder_id: Types.ObjectId; // the specific holder document _id
  last_movement_at?: Date;

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const assetSchema = new Schema<IAsset>(
  {
    asset_no: { type: String, required: true, unique: true, trim: true },
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    serial_no: { type: String, required: false, trim: true },

    status: { type: String, enum: ["ACTIVE", "LOST", "DAMAGED", "RETIRED"], default: "ACTIVE", index: true },

    asset_state: { type: String, enum: ["FULL", "EMPTY", "CLEANING", "UNKNOWN"], default: "UNKNOWN", index: true },

    current_holder_type: {
      type: String,
      enum: ["BRANCH", "VEHICLE", "CUSTOMER", "USER", "SUPPLIER", "OTHER"],
      required: true,
      index: true,
    },
    current_holder_id: { type: Schema.Types.ObjectId, required: true, index: true },

    last_movement_at: { type: Date, required: false },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
  },
  { timestamps: true }
);

// --- Normalizers ---
assetSchema.path("serial_no").set((v: string) => (v ? v.trim().toUpperCase() : v));

// --- Guards + human code ---
assetSchema.pre("validate", async function (next) {
  try {
    // Ensure product exists and is configured as a returnable/serialized asset
    const prod = await Product.findById(this.product_id).select("product_type track_serialized returnable branch_id").lean();

    if (!prod) return next(new Error("Invalid product_id for asset"));

    if (prod.product_type !== "RETURNABLE_ASSET" || !prod.track_serialized || !prod.returnable) {
      return next(new Error("product_id must reference a RETURNABLE_ASSET product (serialized/returnable)"));
    }

    // Generate human-readable asset_no once
    if (this.isNew && !this.asset_no) {
      const branch = await Branch.findById(prod.branch_id).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) return next(new Error("Cannot derive branch scope for asset number"));
      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("ASSET", scope);
      this.asset_no = formatHumanCode("ASSET", scope, seq, 4);
    }

    next();
  } catch (err) {
    next(err as any);
  }
});

// --- Indexes ---
assetSchema.index({ product_id: 1, serial_no: 1 }, { unique: true, sparse: true, name: "uniq_serial_per_product" });
assetSchema.index({ current_holder_type: 1, current_holder_id: 1 }, { name: "by_current_holder" });

// --- Output hygiene ---
assetSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => ret,
});

const Asset: Model<IAsset> = mongoose.model<IAsset>("Asset", assetSchema);
export default Asset;
