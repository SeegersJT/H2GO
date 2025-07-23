import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IConfirmationToken extends Document {
  confirmation_token: string;
  user_id: Types.ObjectId;
  confirmation_token_expiry_date: Date;
  confirmation_token_type: string;
  confirmed: boolean;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const confirmationTokenSchema = new Schema<IConfirmationToken>(
  {
    confirmation_token: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    confirmation_token_expiry_date: { type: Date, required: true },
    confirmation_token_type: { type: String, required: true },
    confirmed: { type: Boolean, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const ConfirmationToken: Model<IConfirmationToken> = mongoose.model<IConfirmationToken>(
  "ConfirmationToken",
  confirmationTokenSchema
);
export default ConfirmationToken;
