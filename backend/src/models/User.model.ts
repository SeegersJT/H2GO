import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IUser extends Document {
  user_no: string;
  branch_id: Types.ObjectId;
  name: string;
  surname: string;
  id_number: string;
  email_address: string;
  mobile_number: string;
  gender: string;
  password: string;
  user_type: string;
  confirmed: boolean;
  active: boolean;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    user_no: { type: String, required: true, unique: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    id_number: { type: String, required: true, unique: true },
    email_address: { type: String, required: true, unique: true },
    mobile_number: { type: String, required: true },
    gender: { type: String, required: false },
    password: { type: String, required: true },
    user_type: { type: String, required: true },
    confirmed: { type: Boolean, required: true },
    active: { type: Boolean, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
