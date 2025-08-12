import mongoose, { Model, Schema } from "mongoose";
import { IUser, UserType } from "../types/auth";

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String, index: true },

    passwordHash: { type: String },
    lastPasswordChangeAt: { type: Date },
    passwordExpiresAt: { type: Date, index: true },
    failedLoginAttempts: { type: Number, default: 0, min: 0 },
    lockedUntil: { type: Date },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER", "UNSPECIFIED"], default: "UNSPECIFIED" },
    dateOfBirth: { type: Date },
    avatarUrl: { type: String },

    isEmailConfirmed: { type: Boolean, default: false, index: true },
    isPhoneConfirmed: { type: Boolean, default: false },
    confirmed: { type: Boolean },

    userType: { type: String, enum: Object.values(UserType), required: true, index: true },
    isActive: { type: Boolean, default: true, index: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },

    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

UserSchema.index({ userType: 1, isActive: 1 });
UserSchema.index({ lockedUntil: 1 });

UserSchema.virtual("isLocked").get(function (this: IUser) {
  return !!this.lockedUntil && this.lockedUntil > new Date();
});

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
