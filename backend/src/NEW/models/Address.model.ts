import mongoose, { Model, Schema } from "mongoose";
import { IAddress } from "../types/location";

const GeoSchema = new Schema({ lat: Number, lng: Number }, { _id: false });

const AddressSchema = new Schema<IAddress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    label: String,
    line1: { type: String, required: true },
    line2: String,
    suburb: String,
    city: String,
    province: String,
    postalCode: String,
    country: { type: Schema.Types.ObjectId, ref: "Country", required: true },
    geo: { type: GeoSchema },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AddressSchema.index({ user: 1, isDefault: 1 });

const Address: Model<IAddress> = mongoose.model<IAddress>("Address", AddressSchema);
export default Address;
