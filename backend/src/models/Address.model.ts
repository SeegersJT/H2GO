import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IAddress extends Document {
  user_id: Types.ObjectId;
  address_line_01: string;
  address_line_02: string;
  suburb: string;
  city: string;
  postal_code: string;
  lat: number;
  lng: number;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    address_line_01: { type: String, required: true },
    address_line_02: { type: String, required: false },
    suburb: { type: String, required: true },
    city: { type: String, required: true },
    postal_code: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Address: Model<IAddress> = mongoose.model<IAddress>("Address", addressSchema);
export default Address;
