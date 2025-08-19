import mongoose, { Schema, Document, Types, Model } from "mongoose";
import Branch from "./Branch.model";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";
import { DeliveryStatus } from "./Delivery.model";

export type InvoiceStatus = "draft" | "issued" | "paid" | "voided" | "partially_paid";

export interface IInvoiceLine {
  product_id: Types.ObjectId; // -> Product
  description?: string;
  quantity: number; // >=1
  unit_price: number; // snapshot
  currency_code?: string;
  tax_rate?: number; // %
  line_date?: Date;
  line_subtotal?: number;
  line_tax?: number;
  line_total?: number;
}

export interface IInvoicePayment {
  payment_id: Types.ObjectId;
  payment_no: string;
  status: "pending" | "succeeded" | "failed" | "refunded" | "voided";
  method: "cash" | "card" | "bank_transfer" | "mobile" | "other";
  amount: number;
  fee?: number;
  reference?: string;
  received_at: Date;
}

export interface IInvoice extends Document {
  invoice_no: string; // "INV-H2GO-0001"
  branch_id: Types.ObjectId; // -> Branch
  user_id: Types.ObjectId; // -> User
  address_id: Types.ObjectId; // -> Address
  order_id?: Types.ObjectId; // -> Order (optional)
  currency_code: string; // ISO-4217

  // Month idempotency anchor
  period_year: number; // e.g., 2025
  period_month: number; // 1..12
  period_key: string; // "YYYY-MM"

  status: InvoiceStatus;
  issue_date: Date;
  due_date?: Date;

  payment_reference?: string;

  lines: IInvoiceLine[];

  deliveries?: {
    delivery_id: Types.ObjectId;
    delivery_no: string;
    status: DeliveryStatus;
    scheduled_for?: Date;
    source?: "manual" | "subscription" | "api";
    chargeable?: boolean;
    amount?: number;
  }[];

  // Snapshot of payments linked to this invoice
  payments?: IInvoicePayment[];

  totals?: {
    subtotal: number;
    tax: number;
    deliveryFee?: number;
    discount?: number;
    total: number;
    amount_paid?: number;
    balance_due?: number;
  };

  notes?: string;
  reference_type?: string;
  reference_id?: Types.ObjectId | null;

  active: boolean;

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const invoiceLineSchema = new Schema<IInvoiceLine>(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    description: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unit_price: { type: Number, required: true, min: 0 },
    currency_code: { type: String, trim: true, set: (v: string) => v?.toUpperCase() },
    tax_rate: { type: Number, min: 0, max: 100 },
    line_date: { type: Date },
    line_subtotal: Number,
    line_tax: Number,
    line_total: Number,
  },
  { _id: false }
);

const invoicePaymentSchema = new Schema<IInvoicePayment>(
  {
    payment_id: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
    payment_no: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "succeeded", "failed", "refunded", "voided"], required: true },
    method: { type: String, enum: ["cash", "card", "bank_transfer", "mobile", "other"], required: true },
    amount: { type: Number, required: true, min: 0 },
    fee: { type: Number, min: 0 },
    reference: { type: String, trim: true },
    received_at: { type: Date, required: true },
  },
  { _id: false }
);

const invoiceDeliverySchema = new Schema(
  {
    delivery_id: { type: Schema.Types.ObjectId, ref: "Delivery", required: true },
    delivery_no: { type: String, required: true },
    status: {
      type: String,
      enum: ["unassigned", "scheduled", "en_route", "arrived", "delivered", "failed", "cancelled"],
      required: true,
    },
    scheduled_for: { type: Date },
    source: { type: String, enum: ["manual", "subscription", "api"] },
    chargeable: { type: Boolean },
    amount: { type: Number, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new Schema<IInvoice>(
  {
    invoice_no: { type: String, required: true, unique: true, trim: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    address_id: { type: Schema.Types.ObjectId, ref: "Address", required: true, index: true },
    order_id: { type: Schema.Types.ObjectId, ref: "Order" },
    currency_code: { type: String, required: true, trim: true, set: (v: string) => v?.toUpperCase() },

    period_year: { type: Number, required: true, min: 1970, index: true },
    period_month: { type: Number, required: true, min: 1, max: 12, index: true },
    period_key: { type: String, required: true, index: true },

    status: { type: String, enum: ["draft", "issued", "paid", "voided", "partially_paid"], default: "draft", index: true },
    issue_date: { type: Date, required: true, default: () => new Date(), index: true },
    due_date: { type: Date },

    payment_reference: { type: String, trim: true, index: true },

    lines: { type: [invoiceLineSchema], validate: [(v: IInvoiceLine[]) => v?.length > 0, "at least one line required"] },
    deliveries: { type: [invoiceDeliverySchema] },
    payments: { type: [invoicePaymentSchema] },

    totals: {
      subtotal: Number,
      tax: Number,
      deliveryFee: Number,
      discount: Number,
      total: Number,
      amount_paid: Number,
      balance_due: Number,
    },

    notes: { type: String, trim: true },
    reference_type: { type: String, trim: true },
    reference_id: { type: Schema.Types.ObjectId, default: null },

    active: { type: Boolean, default: true, index: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

invoiceSchema.pre("validate", async function (next) {
  try {
    const d = this.issue_date ?? new Date();
    if (!this.period_year) this.period_year = d.getUTCFullYear();
    if (!this.period_month) this.period_month = d.getUTCMonth() + 1;
    this.period_key = `${String(this.period_year).padStart(4, "0")}-${String(this.period_month).padStart(2, "0")}`;

    if (this.isNew && !this.invoice_no) {
      const branch = await Branch.findById(this.branch_id).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) return next(new Error("Invalid branch_id for invoice_no"));
      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("INV", scope);
      this.invoice_no = formatHumanCode("INV", scope, seq, 4);
    }

    if (!this.payment_reference && this.invoice_no) {
      this.payment_reference = this.invoice_no;
    }

    next();
  } catch (e) {
    next(e as any);
  }
});

invoiceSchema.index({ branch_id: 1, issue_date: -1 });
invoiceSchema.index({ user_id: 1, address_id: 1, period_key: 1, active: 1 }, { unique: true, partialFilterExpression: { active: true } });

invoiceSchema.set("toJSON", { versionKey: false, transform: (_d, r) => r });

const Invoice: Model<IInvoice> = mongoose.model<IInvoice>("Invoice", invoiceSchema);
export default Invoice;
