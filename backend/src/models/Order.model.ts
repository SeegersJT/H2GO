import mongoose, { Schema, Document, Types, Model } from "mongoose";
import Branch from "./Branch.model";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";

export type OrderSource = "manual" | "subscription" | "api";
export type OrderStatus = "draft" | "confirmed" | "scheduled" | "fulfilled" | "cancelled";

export interface IOrderItem {
  product_id: Types.ObjectId; // -> Product
  name?: string; // denormalized
  quantity: number; // >=1
  unit_price: number; // snapshot
}

export interface IOrder extends Document {
  order_no: string; // "ORDER-H2GO-0001"
  branch_id: Types.ObjectId; // owning branch (for numbering)
  user_id: Types.ObjectId; // -> User
  address_id: Types.ObjectId; // -> Address (delivery address)
  items: IOrderItem[];

  desired_date: Date; // delivery day
  window_start?: string; // "09:00"
  window_end?: string; // "12:00"

  source: OrderSource;
  status: OrderStatus;

  totals?: { subtotal: number; tax?: number; deliveryFee?: number; total: number; currency: string };

  notes?: string;

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unit_price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    order_no: { type: String, required: true, unique: true, trim: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    address_id: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    items: { type: [orderItemSchema], validate: [(v: IOrderItem[]) => v?.length > 0, "at least one item required"] },

    desired_date: { type: Date, required: true, index: true },
    window_start: { type: String },
    window_end: { type: String },

    source: { type: String, enum: ["manual", "subscription", "api"], default: "manual" },
    status: { type: String, enum: ["draft", "confirmed", "scheduled", "fulfilled", "cancelled"], default: "confirmed", index: true },

    totals: {
      subtotal: Number,
      tax: Number,
      deliveryFee: Number,
      total: Number,
      currency: { type: String, default: "ZAR" },
    },

    notes: { type: String, trim: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

orderSchema.pre("validate", async function (next) {
  try {
    if (this.isNew && !this.order_no) {
      const branch = await Branch.findById(this.branch_id).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) return next(new Error("Invalid branch_id for order_no"));
      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("ORDER", scope);
      this.order_no = formatHumanCode("ORDER", scope, seq, 4);
    }
    next();
  } catch (e) {
    next(e as any);
  }
});

orderSchema.index({ branch_id: 1, desired_date: 1 });
orderSchema.set("toJSON", { versionKey: false, transform: (_d, r) => r });

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
