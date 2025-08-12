import mongoose, { Model, Schema } from "mongoose";
import { IDeliverySchedule } from "../types/delivery";

const DefaultLineSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const DeliveryScheduleSchema = new Schema<IDeliverySchedule>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    type: { type: String, enum: ["ONCE", "WEEKLY", "BIWEEKLY", "MONTHLY", "CRON"], required: true },
    params: { type: Schema.Types.Mixed },
    defaultLines: { type: [DefaultLineSchema], default: [] },
    nextRunAt: { type: Date, required: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

DeliveryScheduleSchema.index({ isActive: 1, nextRunAt: 1 });

const DeliverySchedule: Model<IDeliverySchedule> = mongoose.model<IDeliverySchedule>("DeliverySchedule", DeliveryScheduleSchema);
export default DeliverySchedule;
