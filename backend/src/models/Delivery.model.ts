import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IDelivery extends Document {
  user_id: Types.ObjectId;
  address_id: Types.ObjectId;
  product_id: Types.ObjectId;
  delivery_schedule_id: Types.ObjectId;
  delivery_date: Date;
  status: string;
  state: string;
  priority: string;
  empty_inventory_id: Types.ObjectId;
  empty_inventory_note: string;
  full_inventory_id: Types.ObjectId;
  full_inventory_note: string;
  fail_reason?: string;
  completed_by?: Types.ObjectId;
  completed_at?: Date;
  completed_reason?: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const deliverySchema = new Schema<IDelivery>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    address_id: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    delivery_schedule_id: { type: Schema.Types.ObjectId, ref: "DeliverySchedule", required: true },
    delivery_date: { type: Date, required: true },
    status: { type: String, required: true },
    state: { type: String, required: true },
    priority: { type: String, required: true },
    empty_inventory_id: { type: Schema.Types.ObjectId, ref: "Inventory", required: true },
    empty_inventory_note: { type: String, required: true },
    full_inventory_id: { type: Schema.Types.ObjectId, ref: "Inventory", required: true },
    full_inventory_note: { type: String, required: true },
    completed_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    completed_at: { type: Date, required: true },
    completed_reason: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Delivery: Model<IDelivery> = mongoose.model<IDelivery>("Delivery", deliverySchema);
export default Delivery;

// priority: "normal" | "high";
//   status:
//     | "pending"
//     | "in_transit"
//     | "arrived"
//     | "contacting_customer"
//     | "failed_to_contact"
//     | "got_in_touch"
//     | "swapped"
//     | "completed"
//     | "failed";

//   state:
//     | "system_created"
//     | "driver_action"
//     | "admin_action"
//     | "reschedule_pending";

//   swap_details: {
//     product_type_id: Types.ObjectId;
//     empty_container_id?: Types.ObjectId;
//     full_container_id?: Types.ObjectId;
//     note?: string;
//   }[];
