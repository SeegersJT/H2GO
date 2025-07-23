import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IOneTimePin extends Document {
  confirmation_token_id: Types.ObjectId;
  one_time_pin: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const oineTimePinSchema = new Schema<IOneTimePin>(
  {
    confirmation_token_id: { type: Schema.Types.ObjectId, ref: "ConfirmationToken", required: true },
    one_time_pin: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const OneTimePin: Model<IOneTimePin> = mongoose.model<IOneTimePin>("OneTimePin", oineTimePinSchema);
export default OneTimePin;
