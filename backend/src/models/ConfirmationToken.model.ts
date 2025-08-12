import mongoose, { Model, Schema } from "mongoose";
import { IConfirmationToken, ConfirmationTokenType } from "../types/auth";

const ConfirmationTokenSchema = new Schema<IConfirmationToken>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, unique: true },
    type: { type: String, enum: Object.values(ConfirmationTokenType), required: true, index: true },
    otpCode: { type: String },
    otpAttempts: { type: Number, default: 0, min: 0 },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date },
    context: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

ConfirmationTokenSchema.index({ user: 1, type: 1, expiresAt: 1 });

const ConfirmationToken: Model<IConfirmationToken> = mongoose.model<IConfirmationToken>("ConfirmationToken", ConfirmationTokenSchema);
export default ConfirmationToken;
