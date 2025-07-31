import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IDeliverySchedule extends Document {
  user_id: Types.ObjectId;
  address_id: Types.ObjectId;
  product_id: Types.ObjectId;
  schedule_type_id: Types.ObjectId;
  expression: string | Date | Date[];
  start_date?: Date;
  end_date?: Date;
  preferredTime: string;
  active: boolean;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const deliveryScheduleSchema = new Schema<IDeliverySchedule>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    address_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schedule_type_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expression: { type: String, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    preferredTime: { type: String, required: true },
    active: { type: Boolean, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const DeliverySchedule: Model<IDeliverySchedule> = mongoose.model<IDeliverySchedule>("DeliverySchedule", deliveryScheduleSchema);
export default DeliverySchedule;
