import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IBranch extends Document {
  branch_name: string;
  branch_abbreviation: string;
  country_id: Types.ObjectId;
  headoffice_id: Types.ObjectId | null;
  active: boolean;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const branchSchema = new Schema<IBranch>(
  {
    branch_name: { type: String, required: true },
    branch_abbreviation: { type: String, required: true },
    country_id: { type: Schema.Types.ObjectId, ref: "Country", required: true },
    headoffice_id: { type: Schema.Types.ObjectId, ref: "Branch", required: false },
    active: { type: Boolean, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Branch: Model<IBranch> = mongoose.model<IBranch>("Branch", branchSchema);
export default Branch;
