import mongoose, { Schema, Document, Types, Model } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { ConfirmationTokenExpiryMap, ConfirmationTokenType } from "../utils/constants/ConfirmationToken.constant";
import dayjs from "dayjs";

export interface IConfirmationToken extends Document {
  confirmation_token: string; // e.g. "1234-5678-9012-3456-7890"
  confirmation_token_hash: string; // sha256 of digits-only normalization
  user_id: Types.ObjectId; // -> User
  confirmation_token_expiry_date: Date; // TTL date
  confirmation_token_type: ConfirmationTokenType;
  confirmed: boolean; // consumed/success
  confirmed_at?: Date;
  revoked?: boolean; // admin/system invalidation
  revoked_at?: Date;

  // Optional OTP (hashed)
  otp_hash?: string; // bcrypt hash of numeric OTP
  otp_attempts: number; // throttle/brute-force protection
  max_otp_attempts: number; // default 5

  // Optional context
  ip_address?: string;
  user_agent?: string;

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;

  setOtp(otp: string): Promise<void>;
  verifyOtp(otp: string): Promise<boolean>;
}

interface IConfirmationTokenModel extends Model<IConfirmationToken> {
  generateToken(blocks?: number, digitsPerBlock?: number): string;
  generateOtp(digits?: number): string;
  getExpiryDate(type: ConfirmationTokenType): Date;
}

const SALT_ROUNDS = 10;

/** Your preferred generator: "####-####-...". Works for any blocks × digitsPerBlock. */
function generateNumericToken(blocks = 5, digitsPerBlock = 4): string {
  const parts: string[] = [];
  for (let i = 0; i < blocks; i++) {
    const buffer = crypto.randomBytes(3); // ~16M space
    const num = buffer.readUIntBE(0, 3) % Math.pow(10, digitsPerBlock);
    parts.push(num.toString().padStart(digitsPerBlock, "0"));
  }
  return parts.join("-");
}

/** Normalize a token to digits-only for stable hashing & lookups. */
function normalizeForHash(token: string): string {
  return String(token).replace(/\D+/g, ""); // strip hyphens/spaces etc.
}

/** sha256 hex of the normalized token */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(normalizeForHash(token)).digest("hex");
}

const confirmationTokenSchema = new Schema<IConfirmationToken, IConfirmationTokenModel>(
  {
    confirmation_token: {
      type: String,
      required: true,
      trim: true, // stored exactly as generated (e.g., "1234-5678-..."),
    },
    confirmation_token_hash: {
      type: String,
      required: true,
      minlength: 64,
      maxlength: 64,
      select: false, // keep out of normal query results
      index: true,
    },

    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    confirmation_token_expiry_date: { type: Date, required: true, index: true },
    confirmation_token_type: { type: String, required: true, enum: Object.values(ConfirmationTokenType) },
    confirmed: { type: Boolean, required: true, default: false, index: true },
    confirmed_at: { type: Date, required: false },
    revoked: { type: Boolean, required: false, default: false, index: true },
    revoked_at: { type: Date, required: false },

    otp_hash: { type: String, required: false },
    otp_attempts: { type: Number, required: true, default: 0, min: 0 },
    max_otp_attempts: { type: Number, required: true, default: 5, min: 1 },

    ip_address: { type: String, required: false, trim: true },
    user_agent: { type: String, required: false, trim: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
  },
  { timestamps: true }
);

// TTL cleanup (MongoDB auto-removes after expiry)
confirmationTokenSchema.index({ confirmation_token_expiry_date: 1 }, { expireAfterSeconds: 0, name: "ttl_confirmation_token" });

// One ACTIVE token per user per type (unconfirmed + not revoked)
confirmationTokenSchema.index(
  { user_id: 1, confirmation_token_type: 1 },
  {
    unique: true,
    partialFilterExpression: { confirmed: false, revoked: false },
    name: "uniq_active_token_per_user_type",
  }
);

// Validation & derived hash
confirmationTokenSchema.pre("validate", function (next) {
  // Accept any digits-and-hyphens format (allows different blocks/digit sizes).
  // Ensures token starts/ends with a digit; no consecutive hyphens.
  if (!/^\d+(?:-\d+)*$/.test(this.confirmation_token)) {
    return next(new Error("confirmation_token must contain only digits separated by single hyphens"));
  }
  if (this.isNew && this.confirmation_token_expiry_date && this.confirmation_token_expiry_date <= new Date()) {
    return next(new Error("confirmation_token_expiry_date must be in the future"));
  }

  // Always keep the hash in sync with the stored human token
  this.confirmation_token_hash = hashToken(this.confirmation_token);
  next();
});

// Methods (OTP)
confirmationTokenSchema.methods.setOtp = async function setOtp(this: IConfirmationToken, otp: string) {
  this.otp_hash = await bcrypt.hash(String(otp), SALT_ROUNDS);
  this.otp_attempts = 0;
};
confirmationTokenSchema.methods.verifyOtp = async function verifyOtp(this: IConfirmationToken, otp: string) {
  if (!this.otp_hash) return false;
  const ok = await bcrypt.compare(String(otp), this.otp_hash);
  if (!ok) this.otp_attempts += 1;
  return ok;
};
confirmationTokenSchema.statics.getExpiryDate = function (type: ConfirmationTokenType) {
  const { amount, unit } = ConfirmationTokenExpiryMap[type];
  return dayjs().add(amount, unit).toDate();
};

// Output hygiene
confirmationTokenSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret: any) => {
    delete ret.otp_hash;
    delete ret.confirmation_token_hash;
    return ret;
  },
});

// --- Statics (so you can use them anywhere) ---
confirmationTokenSchema.statics.generateToken = function (blocks = 5, digitsPerBlock = 4) {
  return generateNumericToken(blocks, digitsPerBlock);
};
confirmationTokenSchema.statics.generateOtp = function (digits = 6) {
  // single block → "123456" (no hyphens)
  return generateNumericToken(1, digits);
};

const ConfirmationToken = mongoose.model<IConfirmationToken, IConfirmationTokenModel>("ConfirmationToken", confirmationTokenSchema);
export default ConfirmationToken;

// If you also want to import helpers directly:
export { generateNumericToken as generateSecureConfirmationToken, normalizeForHash, hashToken };
