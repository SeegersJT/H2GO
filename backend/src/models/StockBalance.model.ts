import mongoose, { Schema, Document, Types, Model } from "mongoose";

export type HolderType = "BRANCH" | "VEHICLE" | "CUSTOMER" | "USER" | "SUPPLIER" | "OTHER";

export interface IStockBalance extends Document {
  product_id: Types.ObjectId; // -> Product
  holder_type: HolderType;
  holder_id: Types.ObjectId;
  quantity: number; // can be 0 or positive
  branch_id?: Types.ObjectId | null; // optional denorm to speed branch views

  // audit-ish
  last_movement_at?: Date;
  updatedAt?: Date;
  createdAt?: Date;
}

const stockBalanceSchema = new Schema<IStockBalance>(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    holder_type: { type: String, enum: ["BRANCH", "VEHICLE", "CUSTOMER", "USER", "SUPPLIER", "OTHER"], required: true, index: true },
    holder_id: { type: Schema.Types.ObjectId, required: true, index: true },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", default: null },

    last_movement_at: { type: Date },
  },
  { timestamps: true }
);

// 1 balance per product per holder
stockBalanceSchema.index({ product_id: 1, holder_type: 1, holder_id: 1 }, { unique: true, name: "uniq_stock_balance_per_holder" });

// Optional shortcut for branch inventory views
stockBalanceSchema.index({ branch_id: 1, product_id: 1 }, { name: "by_branch_product" });

stockBalanceSchema.set("toJSON", { versionKey: false, transform: (_d, r) => r });

const StockBalance: Model<IStockBalance> = mongoose.model<IStockBalance>("StockBalance", stockBalanceSchema);
export default StockBalance;
