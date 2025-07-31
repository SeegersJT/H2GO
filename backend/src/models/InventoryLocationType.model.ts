import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IInventoryLocationType extends Document {
  location_type_name: string;
  location_type_description: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const inventoryLocationSchema = new Schema<IInventoryLocationType>(
  {
    location_type_name: { type: String, required: true },
    location_type_description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const InventoryLocationType: Model<IInventoryLocationType> = mongoose.model<IInventoryLocationType>("InventoryLocationType", inventoryLocationSchema);
export default InventoryLocationType;

/*
  EXAMPLE:

  at_branch - In stock at a branch (available for delivery or swap)
  with_customer - In possession of a customer
  in_transit - Currently out for delivery or being returned
  lost - Unaccounted for or officially reported lost
  damaged - Damaged and unavailable for use until reviewed
  in_maintenance - In repair, sanitization, or being chacked before use
  in_storage - Returned after user cancellation, rental, or swap rekection
*/
