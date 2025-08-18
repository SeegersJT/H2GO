import mongoose, { Schema, Document, Types, Model } from "mongoose";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";
import Route from "./Route.model";
import Branch from "./Branch.model";

export type DeliveryStatus = "scheduled" | "en_route" | "arrived" | "delivered" | "failed" | "cancelled";

export interface IDelivery extends Document {
  delivery_no: string; // "DLV-H2GO-0001"
  route_id: Types.ObjectId; // -> Route
  branch_id: Types.ObjectId; // redundant but helps scope numbering/queries
  order_id?: Types.ObjectId; // -> Order (optional if ad-hoc)
  user_id: Types.ObjectId; // -> User
  address_id: Types.ObjectId; // -> Address

  sequence: number; // stop order on the route
  window_start?: string;
  window_end?: string;

  status: DeliveryStatus;
  events?: { type: string; at: Date; data?: any }[];

  proof?: {
    recipient_name?: string;
    signature_url?: string;
    photo_urls?: string[];
    notes?: string;
    timestamp?: Date;
  };

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const deliverySchema = new Schema<IDelivery>(
  {
    delivery_no: { type: String, required: true, unique: true, trim: true },
    route_id: { type: Schema.Types.ObjectId, ref: "Route", required: true, index: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    order_id: { type: Schema.Types.ObjectId, ref: "Order" },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    address_id: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    sequence: { type: Number, required: true, default: 0, index: true },
    window_start: { type: String },
    window_end: { type: String },
    status: { type: String, enum: ["scheduled", "en_route", "arrived", "delivered", "failed", "cancelled"], default: "scheduled", index: true },
    events: [{ type: { type: String }, at: { type: Date, default: () => new Date() }, data: Schema.Types.Mixed }],
    proof: {
      recipient_name: String,
      signature_url: String,
      photo_urls: [String],
      notes: String,
      timestamp: Date,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

deliverySchema.pre("validate", async function (next) {
  try {
    if (this.isNew && !this.delivery_no) {
      // derive branch scope from route if not set
      if (!this.branch_id && this.route_id) {
        const route = await Route.findById(this.route_id).select("branch_id").lean();
        if (route?.branch_id) this.branch_id = route.branch_id as any;
      }
      const branch = await Branch.findById(this.branch_id).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) return next(new Error("Invalid branch_id for delivery_no"));
      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("DLV", scope);
      this.delivery_no = formatHumanCode("DLV", scope, seq, 4);
    }
    next();
  } catch (e) {
    next(e as any);
  }
});

deliverySchema.index({ route_id: 1, sequence: 1 });
deliverySchema.set("toJSON", { versionKey: false, transform: (_d, r) => r });
const Delivery: Model<IDelivery> = mongoose.model<IDelivery>("Delivery", deliverySchema);
export default Delivery;
