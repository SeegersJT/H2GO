import mongoose, { Schema, Document, Types, Model } from "mongoose";
import Branch from "./Branch.model";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";

export type RouteStatus = "planning" | "in_progress" | "completed" | "cancelled";

export interface IRoute extends Document {
  route_no: string; // "ROUTE-H2GO-0001"
  branch_id: Types.ObjectId;
  date: Date;
  vehicle_id?: Types.ObjectId; // -> Vehicle
  driver_id?: Types.ObjectId; // -> Driver
  status: RouteStatus;
  notes?: string;

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const routeSchema = new Schema<IRoute>(
  {
    route_no: { type: String, required: true, unique: true, trim: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    date: { type: Date, required: true, index: true },
    vehicle_id: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    driver_id: { type: Schema.Types.ObjectId, ref: "Driver" },
    status: { type: String, enum: ["planning", "in_progress", "completed", "cancelled"], default: "planning", index: true },
    notes: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

routeSchema.pre("validate", async function (next) {
  try {
    if (this.isNew && !this.route_no) {
      const branch = await Branch.findById(this.branch_id).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) return next(new Error("Invalid branch_id for route_no"));
      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("ROUTE", scope);
      this.route_no = formatHumanCode("ROUTE", scope, seq, 4);
    }
    next();
  } catch (e) {
    next(e as any);
  }
});

routeSchema.set("toJSON", { versionKey: false, transform: (_d, r) => r });
const Route: Model<IRoute> = mongoose.model<IRoute>("Route", routeSchema);
export default Route;
