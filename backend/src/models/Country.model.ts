import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface ICountry extends Document {
  country_name: string; // e.g., "South Africa"
  country_code: string; // ISO 3166-1 alpha-2 or alpha-3 (e.g., "ZA" or "ZAF")
  country_dial_code: string; // E.164 country calling code WITHOUT '+', e.g., "27"
  nsn_min_length?: number; // min national significant number length
  nsn_max_length?: number; // max national significant number length
  currency_code?: string; // ISO 4217, e.g., "ZAR"
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const countrySchema = new Schema<ICountry>(
  {
    country_name: { type: String, required: true, trim: true },
    country_code: { type: String, required: true, trim: true }, // normalized to upper below
    country_dial_code: { type: String, required: true, trim: true }, // normalized below
    nsn_min_length: { type: Number, min: 4, max: 15, required: false },
    nsn_max_length: { type: Number, min: 4, max: 15, required: false },
    currency_code: { type: String, required: false, trim: true }, // normalized to upper below
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
  },
  { timestamps: true }
);

// --- Normalizers ---
countrySchema.path("country_code").set((v: string) => v?.toUpperCase());
countrySchema.path("currency_code").set((v: string) => v?.toUpperCase());
countrySchema.path("country_dial_code").set((v: string | number) => String(v).replace(/^\+/, ""));

// --- Basic validation ---
countrySchema.pre("validate", function (next) {
  // ISO alpha-2 or alpha-3 (choose to enforce one form if you prefer)
  if (!/^[A-Z]{2,3}$/.test(this.country_code)) {
    return next(new Error("country_code must be ISO 3166-1 alpha-2 or alpha-3 uppercase letters"));
  }
  if (!/^\d{1,4}$/.test(this.country_dial_code)) {
    return next(new Error("country_dial_code must be 1–4 digits, no '+'"));
  }
  if (this.nsn_min_length && this.nsn_max_length && this.nsn_min_length > this.nsn_max_length) {
    return next(new Error("nsn_min_length cannot be greater than nsn_max_length"));
  }
  next();
});

// --- Indexes ---
countrySchema.index({ country_code: 1 }, { unique: true });
countrySchema.index({ country_name: 1 }, { collation: { locale: "en", strength: 2 } }); // case-insensitive sort/search

// Optional: clean JSON
countrySchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    // nothing sensitive to strip right now; left here for future
    return ret;
  },
});

const Country: Model<ICountry> = mongoose.model<ICountry>("Country", countrySchema);
export default Country;
