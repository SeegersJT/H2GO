// src/models/Vehicle.model.ts
import mongoose, { Schema, Document, Types, Model } from "mongoose";
import Branch from "./Branch.model";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";

export type VehicleType = "bike" | "car" | "van" | "truck";

export interface IVehicle extends Document {
  vehicle_no: string; // e.g., "VEH-H2GO-0001"
  branch_id: Types.ObjectId; // home/base branch
  reg_number: string; // license plate
  type: VehicleType;
  capacity_value?: number; // e.g., 300
  capacity_unit?: "unit" | "L" | "kg";
  active: boolean;

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    vehicle_no: { type: String, required: true, unique: true, trim: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    reg_number: { type: String, required: true, trim: true, unique: true },
    type: { type: String, enum: ["bike", "car", "van", "truck"], default: "van", index: true },
    capacity_value: { type: Number, min: 0 },
    capacity_unit: { type: String, enum: ["unit", "L", "kg"] },
    active: { type: Boolean, default: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

vehicleSchema.pre("validate", async function (next) {
  try {
    if (this.isNew && !this.vehicle_no) {
      const branch = await Branch.findById(this.branch_id).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) return next(new Error("Invalid branch_id for vehicle_no"));
      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("VEH", scope);
      this.vehicle_no = formatHumanCode("VEH", scope, seq, 4);
    }
    next();
  } catch (e) {
    next(e as any);
  }
});

vehicleSchema.set("toJSON", { versionKey: false, transform: (_d, r) => r });
const Vehicle: Model<IVehicle> = mongoose.model<IVehicle>("Vehicle", vehicleSchema);
export default Vehicle;
