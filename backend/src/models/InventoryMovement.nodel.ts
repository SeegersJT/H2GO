// src/models/InventoryMovement.model.ts
import mongoose, { Schema, Document, Types, Model } from "mongoose";
import Asset from "./Asset.model";
import Product from "./Product.model";
import Branch from "./Branch.model";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";

export type HolderType = "BRANCH" | "VEHICLE" | "CUSTOMER" | "USER" | "SUPPLIER" | "OTHER";
export type MovementReason = "DELIVERY" | "PICKUP" | "TRANSFER" | "SWAP" | "ADJUSTMENT" | "RETURN" | "RECONCILIATION";

export interface IInventoryMovement extends Document {
  movement_no: string; // e.g., "MOVE-H2GO-0001"
  product_id?: Types.ObjectId; // -> Product (optional if asset_id provided; will be derived)
  asset_id?: Types.ObjectId; // -> Asset (serialized unit)
  quantity: number; // >=1; if asset_id present, must be 1

  from_holder_type?: HolderType; // optional (e.g., receiving from external supplier)
  from_holder_id?: Types.ObjectId | null;
  to_holder_type: HolderType; // required
  to_holder_id: Types.ObjectId; // required

  reason: MovementReason;
  reference_type?: string; // e.g., "ORDER", "DELIVERY", "ROUTE"
  reference_id?: Types.ObjectId | null;

  moved_at: Date;
  notes?: string;

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const inventoryMovementSchema = new Schema<IInventoryMovement>(
  {
    movement_no: { type: String, required: true, unique: true, trim: true },

    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: false, index: true },
    asset_id: { type: Schema.Types.ObjectId, ref: "Asset", required: false, index: true },

    quantity: { type: Number, required: true, min: 1 },

    from_holder_type: {
      type: String,
      enum: ["BRANCH", "VEHICLE", "CUSTOMER", "USER", "SUPPLIER", "OTHER"],
      required: false,
    },
    from_holder_id: { type: Schema.Types.ObjectId, required: false, default: null },
    to_holder_type: {
      type: String,
      enum: ["BRANCH", "VEHICLE", "CUSTOMER", "USER", "SUPPLIER", "OTHER"],
      required: true,
      index: true,
    },
    to_holder_id: { type: Schema.Types.ObjectId, required: true, index: true },

    reason: {
      type: String,
      enum: ["DELIVERY", "PICKUP", "TRANSFER", "SWAP", "ADJUSTMENT", "RETURN", "RECONCILIATION"],
      required: true,
    },
    reference_type: { type: String, required: false, trim: true },
    reference_id: { type: Schema.Types.ObjectId, required: false, default: null },

    moved_at: { type: Date, required: true, default: () => new Date(), index: true },
    notes: { type: String, required: false, trim: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
  },
  { timestamps: true }
);

// --- Guards + derivations + human code ---
inventoryMovementSchema.pre("validate", async function (next) {
  try {
    // Must have either product or asset
    if (!this.product_id && !this.asset_id) {
      return next(new Error("InventoryMovement requires product_id or asset_id"));
    }

    // If asset provided, quantity must be 1; also derive product_id if missing
    if (this.asset_id) {
      if (this.quantity !== 1) {
        return next(new Error("When asset_id is provided (serialized), quantity must be 1"));
      }

      if (!this.product_id) {
        const asset = await Asset.findById(this.asset_id).select("product_id").lean();

        if (!asset?.product_id) return next(new Error("Invalid asset_id (cannot derive product_id)"));

        this.product_id = asset.product_id as any;
      }
    }

    // from/to cannot be identical pair
    if (
      this.from_holder_type &&
      this.from_holder_id &&
      this.to_holder_type === this.from_holder_type &&
      this.to_holder_id &&
      this.from_holder_id.equals(this.to_holder_id)
    ) {
      return next(new Error("from_holder and to_holder cannot be the same"));
    }

    // Generate movement_no if missing
    if (this.isNew && !this.movement_no) {
      // determine scope (branch) for the counter
      let scopeBranchId: Types.ObjectId | null = null;

      if (this.from_holder_type === "BRANCH" && this.from_holder_id) {
        scopeBranchId = this.from_holder_id as Types.ObjectId;
      } else if (this.to_holder_type === "BRANCH" && this.to_holder_id) {
        scopeBranchId = this.to_holder_id as Types.ObjectId;
      } else if (this.asset_id) {
        // fall back via asset -> product -> branch
        const asset = await Asset.findById(this.asset_id).select("product_id").lean();

        if (asset?.product_id) {
          const prod = await Product.findById(asset.product_id).select("branch_id").lean();
          if (prod?.branch_id) scopeBranchId = prod.branch_id as any;
        }
      } else if (this.product_id) {
        const prod = await Product.findById(this.product_id).select("branch_id").lean();
        if (prod?.branch_id) scopeBranchId = prod.branch_id as any;
      }

      if (!scopeBranchId) return next(new Error("Unable to determine branch scope for movement number"));

      const branch = await Branch.findById(scopeBranchId).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) return next(new Error("Branch scope missing abbreviation"));

      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("MOVE", scope);
      this.movement_no = formatHumanCode("MOVE", scope, seq, 4);
    }

    next();
  } catch (err) {
    next(err as any);
  }
});

// --- Indexes for fast lookups ---
inventoryMovementSchema.index({ asset_id: 1, moved_at: -1 }, { name: "by_asset_recent" });
inventoryMovementSchema.index({ product_id: 1, to_holder_type: 1, to_holder_id: 1, moved_at: -1 }, { name: "to_holder_product" });
inventoryMovementSchema.index({ from_holder_type: 1, from_holder_id: 1, moved_at: -1 }, { name: "from_holder_recent" });
inventoryMovementSchema.index({ reference_type: 1, reference_id: 1 }, { name: "by_reference" });

// --- Output hygiene ---
inventoryMovementSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => ret,
});

const InventoryMovement: Model<IInventoryMovement> = mongoose.model<IInventoryMovement>("InventoryMovement", inventoryMovementSchema);
export default InventoryMovement;
