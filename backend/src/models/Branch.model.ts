// src/models/Branch.model.ts
import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IBranch extends Document {
  branch_name: string;
  branch_abbreviation: string; // short code, uppercased
  country_id: Types.ObjectId; // -> Country
  headoffice_id: Types.ObjectId | null; // -> Branch (parent/HO) or null if this is HO
  active: boolean;
  timezone?: string; // e.g., "Africa/Johannesburg"
  lat?: number; // optional location (keep simple numbers like your Address)
  lng?: number;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const branchSchema = new Schema<IBranch>(
  {
    branch_name: { type: String, required: true, trim: true },
    branch_abbreviation: { type: String, required: true, trim: true }, // normalized to upper below
    country_id: { type: Schema.Types.ObjectId, ref: "Country", required: true, index: true },
    headoffice_id: { type: Schema.Types.ObjectId, ref: "Branch", required: false, default: null, index: true },
    active: { type: Boolean, required: true, default: true, index: true },
    timezone: { type: String, required: false, trim: true },
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
  },
  { timestamps: true }
);

// --- Normalizers ---
branchSchema.path("branch_abbreviation").set((v: string) => v?.toUpperCase());
branchSchema.path("timezone").set((v: string) => v?.trim());

// --- Basic validation & guards ---
branchSchema.pre("validate", function (next) {
  if (!/^[A-Z0-9._-]{2,16}$/.test(this.branch_abbreviation)) {
    return next(new Error("branch_abbreviation must be 2–16 chars: A–Z, 0–9, dot, underscore, or hyphen"));
  }

  if (this.timezone && !/^[A-Za-z_]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)?$/.test(this.timezone)) {
    return next(new Error("timezone should be an IANA-like string (e.g., 'Africa/Johannesburg')"));
  }

  if (this.headoffice_id && this.headoffice_id.toString() === this.id) {
    return next(new Error("headoffice_id cannot reference the same branch (_id)"));
  }

  next();
});

// --- Indexes (names unique within a country) ---
branchSchema.index(
  { country_id: 1, branch_name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 }, name: "uniq_branch_name_per_country" }
);

branchSchema.index({ country_id: 1, branch_abbreviation: 1 }, { unique: true, name: "uniq_branch_abbrev_per_country" });

// Helpful compound for queries like "active branches in country"
branchSchema.index({ country_id: 1, active: 1 });

// Optional: clean JSON
branchSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    // nothing sensitive to strip right now; left here for future
    return ret;
  },
});

const Branch: Model<IBranch> = mongoose.model<IBranch>("Branch", branchSchema);
export default Branch;
