import bcrypt from "bcrypt";
import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { UserType } from "../utils/constants/UserType.constant";
import { formatHumanCode, nextSeq } from "../utils/sequence.utils";
import Branch from "./Branch.model";

export type Gender = "MALE" | "FEMALE";

export interface IUser extends Document {
  user_no: string;
  branch_id: Types.ObjectId; // -> Branch
  name: string;
  surname: string;
  id_number: string;
  email_address: string; // stored lowercase
  mobile_number: string; // digits only, e.g. "27641234567"
  gender?: Gender;
  password: string; // select: false
  password_expiry: Date;
  user_type: UserType;
  confirmed: boolean; // account/email confirmed
  active: boolean;
  failedLoginAttempts: number;
  lastLoginAt?: Date;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;

  comparePassword(candidate: string): Promise<boolean>;
  maskIdNumber(visibleCount?: number, showFromEnd?: boolean): string;
}

interface IUserModel extends Model<IUser> {
  normalizeMobileNumber(mobile: string, countryDialCode: number): string;
}

const SALT_ROUNDS = 10;
const PASSWORD_EXPIRY_DAYS = 90;

const userSchema = new Schema<IUser, IUserModel>(
  {
    user_no: { type: String, required: true, unique: true, trim: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },

    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },

    id_number: { type: String, required: true, unique: true, trim: true },

    email_address: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // normalizes for unique index
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },

    mobile_number: {
      type: String,
      required: true,
      trim: true,
      set: (v: string) => (v ? v.replace(/\D+/g, "") : v), // keep digits only
    },

    gender: {
      type: String,
      required: false,
      enum: ["MALE", "FEMALE"],
      set: (v: string) => (v ? v.toUpperCase() : v),
    },

    password: { type: String, required: true, select: false, minlength: 8 },

    password_expiry: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + PASSWORD_EXPIRY_DAYS * 24 * 3600 * 1000),
    },

    user_type: { type: String, required: true, enum: Object.values(UserType) },

    confirmed: { type: Boolean, required: true, default: false },
    active: { type: Boolean, required: true, default: true },

    failedLoginAttempts: { type: Number, required: true, default: 0, min: 0 },
    lastLoginAt: { type: Date, required: false },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
  },
  { timestamps: true }
);

// --- Indexes for common queries ---
// userSchema.index({ branch_id: 1, active: 1 }); TODO: Determine if needed to be true (i want to return all users, not just active users)
userSchema.index({ user_type: 1, branch_id: 1 });

// --- Password hashing (create/update) ---
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    return next();
  } catch (err) {
    return next(err as any);
  }
});

// Support password updates via findOneAndUpdate
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  if (update?.password) {
    try {
      update.password = await bcrypt.hash(update.password, SALT_ROUNDS);
      // keep select:false behavior when re-reading
      this.setUpdate(update);
    } catch (err) {
      return next(err as any);
    }
  }
  next();
});

userSchema.pre("validate", async function (next) {
  // Only auto-assign for new docs without a user_no
  if (!this.isNew || this.user_no) return next();

  try {
    const branch = await Branch.findById(this.branch_id).select("branch_abbreviation").lean();
    if (!branch?.branch_abbreviation) {
      return next(new Error("Invalid branch_id: branch not found or missing abbreviation"));
    }

    const scope = String(branch.branch_abbreviation).toUpperCase();
    const seq = await nextSeq("USER", scope);
    this.user_no = formatHumanCode("USER", scope, seq, 4);
    next();
  } catch (err) {
    next(err as any);
  }
});

// --- Methods ---
userSchema.methods.comparePassword = function (candidate: string) {
  // Ensure password is selected when you call this: e.g., User.findOne(...).select("+password")
  return bcrypt.compare(candidate, this.password);
};
userSchema.methods.maskIdNumber = function (visibleCount = 4, showFromEnd = true) {
  const input = this.id_number || "";
  if (!input || visibleCount <= 0) {
    return "#".repeat(input.length);
  }
  if (visibleCount >= input.length) {
    return input;
  }
  const maskedLength = input.length - visibleCount;
  const mask = "#".repeat(maskedLength);
  return showFromEnd ? mask + input.slice(-visibleCount) : input.slice(0, visibleCount) + mask;
};

// --- Statics ---
userSchema.statics.normalizeMobileNumber = function (mobile: string, countryDialCode: number): string {
  let normalized = String(mobile).replace(/\D/g, "");
  if (normalized.startsWith("0")) {
    normalized = normalized.substring(1);
  }
  const dialCodeStr = String(countryDialCode);
  if (!normalized.startsWith(dialCodeStr)) {
    normalized = dialCodeStr + normalized;
  }
  return normalized;
};

// --- Output hygiene ---
userSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret: any) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;
