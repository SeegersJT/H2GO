import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface ICountry extends Document {
  country_name: string;
  country_code: string;
  country_dial_code: number;
  max_phone_number_length: number;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const countrySchema = new Schema<ICountry>(
  {
    country_name: { type: String, required: true },
    country_code: { type: String, required: true },
    country_dial_code: { type: Number, required: true },
    max_phone_number_length: { type: Number, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Country: Model<ICountry> = mongoose.model<ICountry>("Country", countrySchema);
export default Country;
