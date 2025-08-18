import mongoose, { Schema, Document, Types, Model } from "mongoose";
import Branch from "./Branch.model";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";

export type InvoiceStatus = "draft" | "issued" | "paid" | "voided" | "partially_paid";

export interface IInvoiceLine {
  product_id: Types.ObjectId; // -> Product
  description?: string; // snapshot/override
  quantity: number; // >=1
  unit_price: number; // snapshot
  currency_code?: string; // optional override
  tax_rate?: number; // e.g., 15 for 15%
  line_subtotal?: number; // computed
  line_tax?: number; // computed
  line_total?: number; // computed
}

export interface IInvoice extends Document {
  invoice_no: string; // "INV-H2GO-0001"
  branch_id: Types.ObjectId; // -> Branch
  user_id: Types.ObjectId; // -> User
  order_id?: Types.ObjectId; // -> Order (optional)
  currency_code: string; // ISO-4217, e.g., "ZAR"

  status: InvoiceStatus;
  issue_date: Date;
  due_date?: Date;

  lines: IInvoiceLine[];

  totals?: {
    subtotal: number;
    tax: number;
    deliveryFee?: number;
    discount?: number;
    total: number;
  };

  notes?: string;
  reference_type?: string; // e.g., "DELIVERY","ORDER","ROUTE"
  reference_id?: Types.ObjectId | null;

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
    line_subtotal: Number,
    line_tax: Number,
    line_total: Number,
  },
  { _id: false }
);

const invoiceSchema = new Schema<IInvoice>(
  {
    invoice_no: { type: String, required: true, unique: true, trim: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    order_id: { type: Schema.Types.ObjectId, ref: "Order" },
    currency_code: { type: String, required: true, trim: true, set: (v: string) => v?.toUpperCase() },

    status: { type: String, enum: ["draft", "issued", "paid", "voided", "partially_paid"], default: "draft", index: true },
    issue_date: { type: Date, required: true, default: () => new Date(), index: true },
    due_date: { type: Date },

    lines: { type: [invoiceLineSchema], validate: [(v: IInvoiceLine[]) => v?.length > 0, "at least one line required"] },

    totals: {
      subtotal: Number,
      tax: Number,
      deliveryFee: Number,
      discount: Number,
      total: Number,
    },

    notes: { type: String, trim: true },
    reference_type: { type: String, trim: true },
    reference_id: { type: Schema.Types.ObjectId, default: null },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

invoiceSchema.pre("validate", async function (next) {
  try {
    if (this.isNew && !this.invoice_no) {
      const branch = await Branch.findById(this.branch_id).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) return next(new Error("Invalid branch_id for invoice_no"));
      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("INV", scope);
      this.invoice_no = formatHumanCode("INV", scope, seq, 4);
    }
    next();
  } catch (e) {
    next(e as any);
  }
});

invoiceSchema.index({ branch_id: 1, issue_date: -1 });
invoiceSchema.set("toJSON", { versionKey: false, transform: (_d, r) => r });

const Invoice: Model<IInvoice> = mongoose.model<IInvoice>("Invoice", invoiceSchema);
export default Invoice;
