import mongoose, { Schema, Document, Types, Model } from "mongoose";
import Branch from "./Branch.model";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";

export type SubscriptionStatus = "active" | "paused" | "cancelled";

export interface ISubscription extends Document {
  subscription_no: string; // "SUB-H2GO-0001"
  branch_id: Types.ObjectId; // -> Branch
  user_id: Types.ObjectId; // -> User
  address_id: Types.ObjectId; // -> Address used for deliveries
  items: { product_id: Types.ObjectId; name?: string; quantity: number; unit_price?: number }[];

  rrule: string; // e.g., FREQ=WEEKLY;BYDAY=WE;INTERVAL=1
  anchor_date: Date; // first occurrence reference
  desired_window?: { start?: string; end?: string };

  next_run_at?: Date; // worker scans this to create Orders
  status: SubscriptionStatus;

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const subscriptionItemSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unit_price: { type: Number, min: 0 },
  },
  { _id: false }
);

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscription_no: { type: String, required: true, unique: true, trim: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    address_id: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    items: { type: [subscriptionItemSchema], validate: [(v: any[]) => v?.length > 0, "at least one item required"] },

    rrule: { type: String, required: true, trim: true },
    anchor_date: { type: Date, required: true },
    desired_window: { start: String, end: String },

    next_run_at: { type: Date, index: true },
    status: { type: String, enum: ["active", "paused", "cancelled"], default: "active", index: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

subscriptionSchema.pre("validate", async function (next) {
  try {
    if (this.isNew && !this.subscription_no) {
      const branch = await Branch.findById(this.branch_id).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) return next(new Error("Invalid branch_id for subscription_no"));
      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("SUB", scope);
      this.subscription_no = formatHumanCode("SUB", scope, seq, 4);
    }
    next();
  } catch (e) {
    next(e as any);
  }
});

subscriptionSchema.set("toJSON", { versionKey: false, transform: (_d, r) => r });
const Subscription: Model<ISubscription> = mongoose.model<ISubscription>("Subscription", subscriptionSchema);
export default Subscription;
