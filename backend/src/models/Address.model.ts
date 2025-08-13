// src/models/Address.model.ts
import mongoose, { Schema, Document, Types, Model } from "mongoose";
import User from "./User.model";
import Branch from "./Branch.model";
import { formatHumanCode, nextSeq } from "../utils/sequence.utils";

export interface IAddress extends Document {
  address_no: string; // e.g., "ADDR-H2GO-0005"
  user_id: Types.ObjectId; // -> User (flat reference)
  country_id?: Types.ObjectId; // -> Country (optional but recommended)
  label?: string; // "Home", "Office"...
  address_line_01: string;
  address_line_02?: string;
  suburb?: string;
  city: string;
  region?: string; // province/state
  postal_code: string;
  lat?: number;
  lng?: number;
  location?: { type: "Point"; coordinates: [number, number] }; // derived from lng/lat
  delivery_instructions?: string;
  contact_person?: string;
  contact_phone?: string; // digits-only normalizer
  is_default?: boolean; // one default per user (enforced via partial unique index)
  active: boolean;

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    address_no: { type: String, required: true, unique: true, trim: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    country_id: { type: Schema.Types.ObjectId, ref: "Country", required: false, index: true },

    label: { type: String, required: false, trim: true },

    address_line_01: { type: String, required: true, trim: true },
    address_line_02: { type: String, required: false, trim: true },
    suburb: { type: String, required: false, trim: true },
    city: { type: String, required: true, trim: true },
    region: { type: String, required: false, trim: true },
    postal_code: { type: String, required: true, trim: true },

    lat: { type: Number, required: false, min: -90, max: 90 },
    lng: { type: Number, required: false, min: -180, max: 180 },

    // GeoJSON point (kept in sync from lng/lat)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        validate: {
          validator: function (v: number[]) {
            if (!v || v.length === 0) return true; // optional
            const [lng, lat] = v;
            return typeof lng === "number" && typeof lat === "number" && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
          },
          message: "coordinates must be [lng, lat] within valid ranges",
        },
        index: "2dsphere",
      },
    },

    delivery_instructions: { type: String, required: false, trim: true },
    contact_person: { type: String, required: false, trim: true },
    contact_phone: {
      type: String,
      required: false,
      trim: true,
      set: (v: string) => (v ? v.replace(/\D+/g, "") : v), // digits only
    },

    is_default: { type: Boolean, required: false, default: false },
    active: { type: Boolean, required: true, default: true, index: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
  },
  { timestamps: true }
);

// Normalizers
addressSchema.path("postal_code").set((v: string) => v?.trim());

// Guard + derived fields
addressSchema.pre("validate", async function (next) {
  try {
    // keep GeoJSON location in sync if lat/lng present
    if (this.isModified("lat") || this.isModified("lng")) {
      if (typeof this.lng === "number" && typeof this.lat === "number") {
        this.location = { type: "Point", coordinates: [this.lng, this.lat] };
      } else {
        this.location = undefined as any;
      }
    }

    // Generate address_no for new docs
    if (this.isNew && !this.address_no) {
      const user = await User.findById(this.user_id).select("branch_id").lean();
      if (!user?.branch_id) return next(new Error("Invalid user_id: user not found or missing branch_id"));

      const branch = await Branch.findById(user.branch_id).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) {
        return next(new Error("Invalid branch: missing branch_abbreviation"));
      }

      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("ADDR", scope);
      this.address_no = formatHumanCode("ADDR", scope, seq, 4);
    }

    next();
  } catch (err) {
    next(err as any);
  }
});

// De-duplicate similar addresses per user (loosely)
addressSchema.index(
  { user_id: 1, address_line_01: 1, city: 1, postal_code: 1 },
  { unique: false, collation: { locale: "en", strength: 2 }, name: "dupe_guard_user_address" }
);

// Enforce only one default address per user
addressSchema.index(
  { user_id: 1, is_default: 1 },
  { unique: true, partialFilterExpression: { is_default: true }, name: "uniq_default_address_per_user" }
);

// Output hygiene
addressSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => ret,
});

const Address: Model<IAddress> = mongoose.model<IAddress>("Address", addressSchema);
export default Address;
