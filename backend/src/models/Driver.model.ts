// src/models/Driver.model.ts
import mongoose, { Schema, Document, Types, Model } from "mongoose";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";
import Branch from "./Branch.model";

export interface IDriver extends Document {
  driver_no: string; // e.g., "DRVR-H2GO-0001"
  user_id: Types.ObjectId; // -> User
  branch_id: Types.ObjectId; // operating branch
  license_class?: string;
  phone?: string;
  active: boolean;

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const driverSchema = new Schema<IDriver>(
  {
    driver_no: { type: String, required: true, unique: true, trim: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    license_class: { type: String, trim: true },
    phone: { type: String, trim: true, set: (v: string) => (v ? v.replace(/\D+/g, "") : v) },
    active: { type: Boolean, default: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

driverSchema.pre("validate", async function (next) {
  try {
    if (this.isNew && !this.driver_no) {
      const branch = await Branch.findById(this.branch_id).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) return next(new Error("Invalid branch_id for driver_no"));
      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("DRVR", scope);
      this.driver_no = formatHumanCode("DRVR", scope, seq, 4);
    }
    next();
  } catch (e) {
    next(e as any);
  }
});

driverSchema.set("toJSON", { versionKey: false, transform: (_d, r) => r });
const Driver: Model<IDriver> = mongoose.model<IDriver>("Driver", driverSchema);
export default Driver;
