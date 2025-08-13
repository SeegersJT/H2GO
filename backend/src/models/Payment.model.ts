import mongoose, { Schema, Document, Types, Model } from "mongoose";
import Branch from "./Branch.model";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";

export type PaymentMethod = "cash" | "card" | "bank_transfer" | "mobile" | "other";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded" | "voided";

export interface IPayment extends Document {
  payment_no: string; // "PMT-H2GO-0001"
  branch_id: Types.ObjectId; // -> Branch
  customer_id: Types.ObjectId; // -> Customer
  invoice_id?: Types.ObjectId | null; // -> Invoice (optional prepayment)
  method: PaymentMethod;
  status: PaymentStatus;

  currency_code: string; // ISO-4217
  amount: number; // positive
  fee?: number; // gateway fees (optional)
  reference?: string; // external ref/txn id
  received_at: Date;

  notes?: string;

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    payment_no: { type: String, required: true, unique: true, trim: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    invoice_id: { type: Schema.Types.ObjectId, ref: "Invoice", default: null, index: true },

    method: { type: String, enum: ["cash", "card", "bank_transfer", "mobile", "other"], required: true, index: true },
    status: { type: String, enum: ["pending", "succeeded", "failed", "refunded", "voided"], required: true, default: "succeeded", index: true },

    currency_code: { type: String, required: true, trim: true, set: (v: string) => v?.toUpperCase() },
    amount: { type: Number, required: true, min: 0 },
    fee: { type: Number, min: 0 },
    reference: { type: String, trim: true },
    received_at: { type: Date, required: true, default: () => new Date(), index: true },

    notes: { type: String, trim: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

paymentSchema.pre("validate", async function (next) {
  try {
    if (this.isNew && !this.payment_no) {
      const branch = await Branch.findById(this.branch_id).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) return next(new Error("Invalid branch_id for payment_no"));
      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("PMT", scope);
      this.payment_no = formatHumanCode("PMT", scope, seq, 4);
    }
    next();
  } catch (e) {
    next(e as any);
  }
});

paymentSchema.index({ customer_id: 1, received_at: -1 }, { name: "payments_by_customer_recent" });
paymentSchema.set("toJSON", { versionKey: false, transform: (_d, r) => r });

const Payment: Model<IPayment> = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;
