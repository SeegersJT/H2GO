import mongoose, { Model, Schema } from "mongoose";
import { IBranch } from "../types/location";

const BranchSchema = new Schema<IBranch>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    country: { type: Schema.Types.ObjectId, ref: "Country", required: true },
    address: { type: Schema.Types.ObjectId, ref: "Address" },
    isActive: { type: Boolean, default: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Branch: Model<IBranch> = mongoose.model<IBranch>("Branch", BranchSchema);
export default Branch;
