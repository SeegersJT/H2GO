import mongoose, { Model, Schema } from "mongoose";
import { IVehicle } from "../types/location";

const VehicleSchema = new Schema<IVehicle>(
  {
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    regNumber: { type: String, required: true, unique: true, uppercase: true },
    capacityUnits: Number,
    isActive: { type: Boolean, default: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Vehicle: Model<IVehicle> = mongoose.model<IVehicle>("Vehicle", VehicleSchema);
export default Vehicle;
