import mongoose, { Schema } from "mongoose";
import { ICountry } from "../types/location";

const CountrySchema = new Schema<ICountry>(
  {
    name: { type: String, required: true, index: true },
    iso2: { type: String, required: true, minlength: 2, maxlength: 2, uppercase: true, unique: true },
    iso3: { type: String, required: true, minlength: 3, maxlength: 3, uppercase: true, unique: true },
    phoneCode: String,
    currency: String,
  },
  { timestamps: true }
);

export default mongoose.model<ICountry>("Country", CountrySchema);
