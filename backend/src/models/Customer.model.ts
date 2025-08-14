import mongoose, { Schema, Document, Types, Model } from "mongoose";
import Branch from "./Branch.model";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";

export interface ICustomer extends Document {
  customer_no: string; // e.g., "CUST-H2GO-0001"
  branch_id: Types.ObjectId; // -> Branch (account owner/sales branch)
  name: string;
  email?: string;
  phone?: string; // digits-only
  default_address_id?: Types.ObjectId; // -> Address
  active: boolean;
  tags?: string[];

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    customer_no: { type: String, required: true, unique: true, trim: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true, set: (v: string) => (v ? v.replace(/\D+/g, "") : v) },
    default_address_id: { type: Schema.Types.ObjectId, ref: "Address" },
    active: { type: Boolean, required: true, default: true, index: true },
    tags: [String],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

customerSchema.pre("validate", async function (next) {
  try {
    if (this.isNew && !this.customer_no) {
      const branch = await Branch.findById(this.branch_id).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) return next(new Error("Invalid branch_id for customer_no"));
      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("CUST", scope);
      this.customer_no = formatHumanCode("CUST", scope, seq, 4);
    }
    next();
  } catch (e) {
    next(e as any);
  }
});

customerSchema.index({ branch_id: 1, name: 1 }, { collation: { locale: "en", strength: 2 }, name: "search_name_per_branch" });
customerSchema.set("toJSON", { versionKey: false, transform: (_d, r) => r });

const Customer: Model<ICustomer> = mongoose.model<ICustomer>("Customer", customerSchema);
export default Customer;
