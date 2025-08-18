import mongoose, { Schema, Document, Types, Model } from "mongoose";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";
import Route from "./Route.model";
import Branch from "./Branch.model";

export type DeliveryStatus = "scheduled" | "en_route" | "arrived" | "delivered" | "failed" | "cancelled";
export type OrderSource = "manual" | "subscription" | "api";

export interface IOrderItem {
  product_id: Types.ObjectId; // -> Product
  name?: string; // denormalized
  quantity: number; // >= 1
  unit_price: number; // snapshot
}

export interface IOrderEvent {
  type: string;
  at: Date;
  data?: any;
}

export interface IDelivery extends Document {
  delivery_no: string; // "DLV-H2GO-0001"
  route_id: Types.ObjectId; // -> Route
  branch_id: Types.ObjectId; // redundant but helps scope numbering/queries
  user_id: Types.ObjectId; // -> User
  address_id: Types.ObjectId; // -> Address

  items: IOrderItem[];

  sequence: number; // stop order on the route
  window_start?: string; // "HH:mm"
  window_end?: string; // "HH:mm"

  source: OrderSource;
  status: DeliveryStatus;
  events?: IOrderEvent[];

  proof?: {
    recipient_name?: string;
    signature_url?: string;
    photo_urls?: string[];
    notes?: string;
    timestamp?: Date;
  };

  active: boolean;

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const orderItemSchema = new Schema<IOrderItem>(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unit_price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderEventSchema = new Schema<IOrderEvent>(
  {
    type: { type: String, required: true, trim: true },
    at: { type: Date, required: true, default: () => new Date() },
    data: Schema.Types.Mixed,
  },
  { _id: false }
);

const deliverySchema = new Schema<IDelivery>(
  {
    delivery_no: { type: String, required: true, unique: true, trim: true },

    route_id: { type: Schema.Types.ObjectId, ref: "Route", required: true, index: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    address_id: { type: Schema.Types.ObjectId, ref: "Address", required: true },

    items: {
      type: [orderItemSchema],
      validate: [(v: IOrderItem[]) => Array.isArray(v) && v.length > 0, "at least one item required"],
    },

    sequence: { type: Number, required: true, default: 0, index: true },

    window_start: {
      type: String,
      validate: {
        validator: (v: string | undefined) => !v || timeRegex.test(v),
        message: "window_start must be in HH:mm format",
      },
    },
    window_end: {
      type: String,
      validate: [
        {
          validator: (v: string | undefined) => !v || timeRegex.test(v),
          message: "window_end must be in HH:mm format",
        },
        {
          // ensure start < end when both provided
          validator: function (this: IDelivery, v: string | undefined) {
            if (!this.window_start || !v) return true;
            return this.window_start < v;
          },
          message: "window_start must be earlier than window_end",
        },
      ],
    },

    source: { type: String, enum: ["manual", "subscription", "api"], default: "manual" },

    status: {
      type: String,
      enum: ["scheduled", "en_route", "arrived", "delivered", "failed", "cancelled"],
      default: "scheduled",
      index: true,
    },

    events: { type: [orderEventSchema] },

    proof: {
      recipient_name: String,
      signature_url: String,
      photo_urls: [String],
      notes: String,
      timestamp: Date,
    },

    active: { type: Boolean, required: true, default: true, index: true },

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

deliverySchema.pre("save", function (next) {
  if (this.isNew) {
    if (!this.events) this.events = [];
    this.events.push({
      type: "created",
      at: new Date(),
      data: {
        status: this.status,
        source: this.source,
        delivery_no: this.delivery_no,
      },
    });
  }
  next();
});

deliverySchema.index({ route_id: 1, sequence: 1 });
// (optional) helpful secondary indexes
// deliverySchema.index({ branch_id: 1, status: 1, active: 1 });

deliverySchema.set("toJSON", { versionKey: false, transform: (_d, r) => r });

const Delivery: Model<IDelivery> = mongoose.model<IDelivery>("Delivery", deliverySchema);
export default Delivery;
