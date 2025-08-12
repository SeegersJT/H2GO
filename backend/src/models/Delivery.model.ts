import mongoose, { Model, Schema } from "mongoose";
import { IDelivery, IDeliveryLine } from "../types/delivery";

const DeliveryLineSchema = new Schema<IDeliveryLine>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    requestedQty: { type: Number, required: true, min: 0 },
    allocatedItems: [{ type: Schema.Types.ObjectId, ref: "InventoryItem" }],
    notes: String,
  },
  { _id: false }
);

const DeliverySchema = new Schema<IDelivery>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    address: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "User" },
    plannedAt: { type: Date, required: true, index: true },
    status: { type: String, enum: ["SCHEDULED", "ALLOCATED", "ENROUTE", "ARRIVED", "COMPLETED", "FAILED", "CANCELLED"], default: "SCHEDULED" },
    lines: { type: [DeliveryLineSchema], default: [] },
    schedule: { type: Schema.Types.ObjectId, ref: "DeliverySchedule" },
    audit: {
      enrouteAt: Date,
      arrivedAt: Date,
      completedAt: Date,
      failedAt: Date,
    },
    notes: String,
  },
  { timestamps: true }
);

DeliverySchema.index({ branch: 1, plannedAt: 1 });
DeliverySchema.index({ driver: 1, plannedAt: 1 });

const Delivery: Model<IDelivery> = mongoose.model<IDelivery>("Delivery", DeliverySchema);
export default Delivery;
